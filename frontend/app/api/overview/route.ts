export async function GET(request: Request) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/api/overview`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch reserve Data: ${response.status} ${response.statusText}`
        );
      }
  
      const result = await response.json();
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("API Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch reserve Data" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  