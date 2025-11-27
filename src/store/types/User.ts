export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "engineer" | "user" | "planning" | "production" | "quality" | "material";
    companyName?: string;
    customerId?: string;
}
