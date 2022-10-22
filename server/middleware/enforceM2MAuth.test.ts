import { beforeEach, test } from "@jest/globals";
import { nanoid } from "nanoid/non-secure";
import type { Context } from "../context";
import { enforceM2MAuth } from "./enforceM2MAuth";

const next = jest.fn();
const env = process.env;

const JWT_PUBLIC =
  "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHYk1CQUdCeXFHU000OUFnRUdCU3VCQkFBakE0R0dBQVFCRFhLbUkrTEVva1h1bzdRclZoMjFBVFdPbUVVUQpFK2h0Qk1HTTZZRkZWWE5zd2pYa2ovaTUzU1NtUW1Yc2w4WFdnWjI0eWtCUVlQbHdMTFU4SGJ4MzF6c0JFNDZjCnh1cHpicVg4bFozY3NteXdaV3ZVS0hMTXFLelAwRVVXRFBRaXF4M3gwbEFINURpbXI0TzIyQ01iRGN6Wm1sWlYKMjdDQnY2ODR1RDY1WnVVcTNpWT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg";
// const JWT_PRIVATE =
//   "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSHVBZ0VBTUJBR0J5cUdTTTQ5QWdFR0JTdUJCQUFqQklIV01JSFRBZ0VCQkVJQWlDRENHUmdWaytVbGxVbVMKY1R5dmllRHZkM0pQejEzanNPMjZudkt0OUp5YUFGL3hZcFBueFBMWTlGcEZYdVBaY2FlUWFjc2JVam5GdmF0ago4M09kS0FlaGdZa0RnWVlBQkFFTmNxWWo0c1NpUmU2anRDdFdIYlVCTlk2WVJSQVQ2RzBFd1l6cGdVVlZjMnpDCk5lU1ArTG5kSktaQ1pleVh4ZGFCbmJqS1FGQmcrWEFzdFR3ZHZIZlhPd0VUanB6RzZuTnVwZnlWbmR5eWJMQmwKYTlRb2NzeW9yTS9RUlJZTTlDS3JIZkhTVUFma09LYXZnN2JZSXhzTnpObWFWbFhic0lHL3J6aTRQcmxtNVNyZQpKZz09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K";

beforeEach(() => {
  process.env = { ...env };
  next.mockReset();
});

test("throws without public key", async () => {
  const ctx = {};
  const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Missing JWT public key"`
  );
  expect(next).not.toBeCalled();
});

describe("with public key", () => {
  beforeEach(() => {
    process.env = { ...process.env, JWT_PUBLIC };
  });

  test("throws without Authorization header", async () => {
    const ctx = {};
    const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
    await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"UNAUTHORIZED"`
    );
    expect(next).not.toBeCalled();
  });

  test("throws with random string in authorization header", async () => {
    const ctx = {
      authorization: `${nanoid()}`,
    } as Context;
    const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
    await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"BAD_REQUEST"`
    );
    expect(next).not.toBeCalled();
  });

  test("throws with random string as bearer token", async () => {
    const ctx = {
      authorization: `Bearer ${nanoid()}`,
    } as Context;
    const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
    await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"JWT verification failed"`
    );
    expect(next).not.toBeCalled();
  });

  test("throws with JWT signed by another key", async () => {
    const ctx = {
      authorization:
        "Bearer eyJhbGciOiJFUzUxMiJ9.eyJpYXQiOjE2NjU5MTU4NDgsImlzcyI6IkhvbWVQYW5lbE0yTSIsInN1YiI6IlRlc3QxMjMifQ.AVH2oJIl_cyTvlX6epANnK1rqqi4wGc4MQ8ZvyBpCdarYlqFp01VriHGLOVCB3zB-zbyYnaWszdzKkzhitLCiy1yAKha1UfE3ZlIigFM6gh_zw_CRZmomY0G4YgAFZnFBnvTe-o_rIxbRwmpcxV6vkFBWHo_srPZzf3-geY2tqcgljj5",
    } as Context;
    const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
    await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"JWT verification failed"`
    );
    expect(next).not.toBeCalled();
  });

  test("works with JWT signed by the correct key", async () => {
    const ctx = {
      authorization:
        "Bearer eyJhbGciOiJFUzUxMiJ9.eyJpYXQiOjE2NjU5MTU2NDUsImlzcyI6IkhvbWVQYW5lbE0yTSIsInN1YiI6IlRlc3QxMjMifQ.AbviuEsd1yYRvtnh0w0FpfpjzmCrTVPWuMCXrjmqKMmGgzPigPjS7YwnTRFbRLu1zBx5oKpxs48KyRM3Fe67QCFQARm0sajYj5B2CKWH4lDNTcFmvW_PMnB4Oc4VgZ5CxeLItTi_IKPn1A_gBJdgauES5cAN_MstaXLdlw1rsQLC8Yq7",
    } as Context;
    const middlewarePromise = enforceM2MAuth({ next, ctx } as any);
    await expect(middlewarePromise).resolves.toBeUndefined();
    expect(next).toBeCalledTimes(1);
  });
});
