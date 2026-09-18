import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Nuzi AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Nuzi AI Verification Code",
            text: `Your Nuzi AI verification code is ${otp}. This OTP is valid for 3 minutes.`,
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: auto;
                    padding: 30px;
                    background: #101016;
                    color: #ffffff;
                    border-radius: 16px;
                ">
                    <h2>Nuzi AI</h2>

                    <p>Your verification code is:</p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        margin: 25px 0;
                    ">
                        ${otp}
                    </div>

                    <p style="color: #aaaaaa;">
                        This OTP is valid for 3 minutes.
                    </p>

                    <p style="color: #aaaaaa;">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
            `,
        });

        console.log(`OTP email sent to: ${email}`);

        return true;
    } catch (error) {
        console.error("OTP email error:", error.message);

        return false;
    }
};