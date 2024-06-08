// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ req, token }) => {
//       console.log("authorized");
//       return true;
//     },
//   },
// });
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home(/.*)?", "/case(/.*)?", "/api/admin(/.*)?"],
};
