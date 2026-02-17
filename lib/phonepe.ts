export const phonePeConfig = {
    clientId: (process.env.PHONEPE_CLIENT_ID || "").trim(),
    clientSecret: (process.env.PHONEPE_CLIENT_SECRET || "").trim(),
    clientVersion: (process.env.PHONEPE_CLIENT_VERSION || "1").trim(),
    env: (process.env.PHONEPE_ENV || "UAT").trim(),
};

// Diagnostic log for deployment monitoring
console.log(`[PhonePe] Initialized with ENV: ${phonePeConfig.env}`);

export const getPhonePeUrls = () => {
    const isProduction = phonePeConfig.env === "PRODUCTION";
    return {
        tokenUrl: isProduction
            ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
            : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
        payUrl: isProduction
            ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
            : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
        statusUrl: (merchantOrderId: string) =>
            isProduction
                ? `https://api.phonepe.com/apis/pg/checkout/v2/order/${merchantOrderId}/status`
                : `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${merchantOrderId}/status`,
    };
};

export async function getAccessToken(): Promise<string | null> {
    const { tokenUrl } = getPhonePeUrls();
    try {
        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: phonePeConfig.clientId,
                client_version: phonePeConfig.clientVersion,
                client_secret: phonePeConfig.clientSecret,
                grant_type: "client_credentials",
            }).toString(),
        });
        const data = await response.json();
        if (data.access_token) {
            return data.access_token;
        }
        console.error("Failed to get PhonePe token:", data);
        return null;
    } catch (e) {
        console.error("Error getting PhonePe token:", e);
        return null;
    }
}
