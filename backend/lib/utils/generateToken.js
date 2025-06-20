import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '2d', // Token expiration time
    });

  res.cookie("jwt", token, { 
    maxAge: 2 * 24 * 60 * 60 * 1000, // Cookie expiration time (2 days)
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: "strict", // Helps prevent CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in development mode but change when in production in ENV file
  })  
}



// export const generateTokenAndSetCookie = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '2d',
//   });

//   res.cookie("jwt", token, {
//     maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "development",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
//     path: "/",
//   });

//   return token; // Optional: return token if needed elsewhere
// };