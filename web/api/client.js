import ky from "ky";
import { parseCookies } from "nookies";

const client = () => {
  const cookie = parseCookies();

  return ky.extend({
    prefixUrl: "/api",
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("X-Requested-With", "ky");
        },
      ],
    },
  });
};

const authApi = ky.extend({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("X-Requested-With", "ky");
      },
    ],
  },
});

export default client();
export const auth = authApi;
