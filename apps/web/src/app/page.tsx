import Link from 'next/link';
import Image from "next/image";
import c from "@/hackkit.config";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<Link href="/dash"> <Image src={c.icon.lg} alt="The HackKit Logo" width={400} height={400} /> </Link>
			<h1 className="font-sans font-black text-5xl mt-5">HackKit</h1>
		</main>
	);
}
