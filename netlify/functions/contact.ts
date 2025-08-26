export async function handler(event: any) {
    if (event.httpMethod !== "POST") {
        return {statusCode: 405, body: "Method Not Allowed"};
    }

    const data = JSON.parse(event.body || "{}");

    console.log("Received contact form data:", data);

    return {
        statusCode: 200,
        body: JSON.stringify({message: "Form submitted successfully!"}),
    };
}
