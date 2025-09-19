import { useLocation, useNavigate } from "@solidjs/router";

/**
 * This function is used to create a delay in the code execution.
 * In cases where you want to test the loading state of a component
 * or the that the <Suspense> component is working correctly.
 * @param ms - The number of milliseconds to wait before resolving the promise.
 */
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
// set in top level .env
const USE_API_TEST_DELAY = import.meta.env.USE_API_TEST_DELAY;
const API_TEST_DELAY = import.meta.env.API_TEST_DELAY;

export class HttpError extends Error {
  statusCode: number;
  response: Response;

  constructor(statusCode: number, message: string, response: Response) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

const useHttps = import.meta.env.USE_HTTPS;
const developmentProtocol = useHttps ? "https" : "http";
const host = window.location.hostname;
export const baseUrl = `${developmentProtocol}://${host}:8080/api`;

export const useRequests = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const callFetch = async <TData>(
    url: string,
    options: RequestInit,
    callback?: (res: Response) => Promise<TData | null>,
  ): Promise<TData | null> => {
    if (true) {
      await sleep(API_TEST_DELAY);
    }
    const res = await fetch(`${baseUrl}${url}`, options);
    if (!res.ok) {
      alert("Hey buddy");
    }
    if (callback) {
      try {
        return await callback(res);
      } catch (error) {
        console.error("Error in callback:", error);
        return null;
      }
    }
    try {
      return (await res.json()) as Promise<TData>;
    } catch (error) {
      console.error("Error parsing response:", error);
      return null;
    }
  };

  const baseConfig: RequestInit = {
    credentials: "include",
  };

  return {
    get: async <T>(url: string): Promise<T | null> => {
      return await callFetch<T>(url, baseConfig, async (res: Response) => {
        if (res.status === 204) {
          return null;
        }
        return (await res.json()) as Promise<T>;
      });
    },
    getFile: async (url: string) => {
      return await callFetch<null>(
        url,
        {
          ...baseConfig,
          method: "GET",
          cache: "no-store",
        },
        async (res: Response) => {
          const blob = await res.blob();
          const u = URL.createObjectURL(blob);
          window.open(u, "_blank");
          setTimeout(() => URL.revokeObjectURL(u), 10000);
          return null;
        },
      );
    },
    post: async <T extends BodyInit | object, U>(
      url: string,
      body: T,
    ): Promise<Response | U | HttpError | null> => {
      const opts: RequestInit =
        body instanceof FormData
          ? {
              body: body,
            }
          : {
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            };
      return callFetch(url, { ...opts, method: "POST", ...baseConfig });
    },
    put: async <T extends BodyInit | object, U>(
      url: string,
      body: T,
    ): Promise<Response | U | HttpError | null> => {
      const opts: RequestInit =
        body instanceof FormData
          ? {
              body: body,
            }
          : {
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            };
      return callFetch(url, { ...opts, method: "PUT", ...baseConfig });
    },
    patch: async <T extends object>(
      url: string,
      body: T,
    ): Promise<Response | HttpError | null> => {
      return await callFetch(url, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        ...baseConfig,
      });
    },
    delete: async (url: string) => {
      return await callFetch(url, {
        ...baseConfig,
        method: "DELETE",
      });
    },
    navigate: navigate,
    location: path,
  };
};
