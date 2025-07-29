import jwt from "jsonwebtoken";

export const generateJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY, 
            {
                expiresIn: "1h" 
            },
            (err, token) => {
                if (err) {
                    console.error(err); 
                    reject({
                        success: false,
                        message: "Could not generate token"
                    });
                } else {
                    resolve(token);
                }
            }
        );
    });
};