import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { nanoid } from "nanoid";

function createContext(cookie?: string) {
  const cookies: Array<{ name: string; value: string }> = [];
  const ctx = {
    user: null,
    req: { protocol: "https", headers: cookie ? { cookie } : {} },
    res: {
      cookie: (name: string, value: string) => cookies.push({ name, value }),
      clearCookie: () => {},
    },
  } as unknown as TrpcContext;
  return { ctx, cookies };
}

async function createAdminCaller() {
  const loginContext = createContext();
  const loginCaller = appRouter.createCaller(loginContext.ctx);
  await loginCaller.admin.login({ username: "admin", password: "admin123" });
  const token = loginContext.cookies.find(cookie => cookie.name === "admin_session")?.value;
  const caller = appRouter.createCaller(createContext(`admin_session=${token}`).ctx);
  return caller;
}

describe("admin tools", () => {
  it("rejects management tools without a signed admin session", async () => {
    const caller = appRouter.createCaller(createContext().ctx);
    await expect(caller.admin.users.list()).rejects.toThrow();
    await expect(caller.admin.exportBookings()).rejects.toThrow();
  });

  it("allows a signed administrator to review users and export bookings", async () => {
    const caller = await createAdminCaller();
    const [accounts, rows] = await Promise.all([caller.admin.users.list(), caller.admin.exportBookings()]);
    expect(accounts.some(account => account.username === "admin" && account.isActive)).toBe(true);
    expect(Array.isArray(rows)).toBe(true);
  });

  it("creates and removes a secondary administrator while protecting the current account", async () => {
    const caller = await createAdminCaller();
    const username = `manager_${nanoid(8)}`;
    await caller.admin.users.create({ username, name: "مسؤول اختبار", password: "secure-pass-123" });

    const accounts = await caller.admin.users.list();
    expect(accounts.some(account => account.username === username && account.isActive)).toBe(true);

    await caller.admin.users.update({ username, name: "مسؤول اختبار محدث", password: "updated-pass-123" });
    const updatedAccounts = await caller.admin.users.list();
    expect(updatedAccounts.find(account => account.username === username)?.name).toBe("مسؤول اختبار محدث");

    await expect(caller.admin.users.setActive({ username: "admin", isActive: false })).rejects.toThrow();
    await caller.admin.users.remove({ username });

    const afterRemove = await caller.admin.users.list();
    expect(afterRemove.some(account => account.username === username)).toBe(false);
  });

  it("allows an administrator to pause and restore a booking service", async () => {
    const caller = await createAdminCaller();
    const services = await caller.services.listForAdmin();
    const target = services.find(service => service.id === 5) ?? services[0];
    expect(target).toBeDefined();

    await caller.services.setActive({ id: target!.id, isActive: false });
    const publicWhilePaused = await caller.services.list();
    expect(publicWhilePaused.some(service => service.id === target!.id)).toBe(false);

    await caller.services.setActive({ id: target!.id, isActive: true });
    const publicAfterRestore = await caller.services.list();
    expect(publicAfterRestore.some(service => service.id === target!.id)).toBe(true);
  });

  it("allows an administrator to manage branches without exposing paused branches publicly", async () => {
    const caller = await createAdminCaller();
    const existing = await caller.branches.listForAdmin();
    const target = existing[0];
    expect(target).toBeDefined();

    await caller.branches.setActive({ id: target!.id, isActive: false });
    const publicWhilePaused = await caller.branches.list();
    expect(publicWhilePaused.some(branch => branch.id === target!.id)).toBe(false);
    await caller.branches.setActive({ id: target!.id, isActive: true });

    const slug = `test-branch-${nanoid(6).toLowerCase()}`;
    const created = await caller.branches.create({ slug, name: "فرع اختبار الإدارة", shortName: "فرع اختبار", city: "الرياض", address: "عنوان اختبار", phone: "0110000000" });
    expect((await caller.branches.list()).some(branch => branch.id === created.id)).toBe(true);
    await caller.branches.setActive({ id: created.id, isActive: false });
    expect((await caller.branches.list()).some(branch => branch.id === created.id)).toBe(false);
  });
});
