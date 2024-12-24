"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
    const [count, setCount] = useState(0);
    const path = usePathname();
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link> {path === "/" ? "❤️" : ""}
                </li>
                <li>
                    <Link href="/about-us">About Us</Link> {path === "/about-us" ? "❤️" : ""}
                </li>
                <button onClick={() => setCount(count + 1)}>{count}</button>
            </ul>
        </nav>
    );
}