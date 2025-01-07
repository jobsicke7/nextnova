export async function fetchPostById(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/astroinfo/${id}`);
    if (!res.ok) return null;
    return res.json();
}