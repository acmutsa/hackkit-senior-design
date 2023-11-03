import c from "@/hackkit.config";
import { Badge } from "@/components/shadcn/ui/badge";
import { BsFillPatchCheckFill } from "react-icons/bs";

interface RoleBadgeProps {
	role: keyof typeof c.roleBadges;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
	return (
		<Badge
			style={{ backgroundColor: c.roleBadges[role].color }}
			className={`${c.roleBadges[role].checked ? "px-1" : ""} gap-x-1`}
		>
			<span style={{ color: c.roleBadges[role].foreground }}>{c.roleBadges[role].title}</span>
			{c.roleBadges[role].checked ? (
				<BsFillPatchCheckFill
					className="text-lg"
					style={{
						color: `color-mix(in hsl longer hue, ${c.roleBadges[role].color} 95%, ${c.roleBadges[role].foreground})`
					}}
				/>
			) : null}
		</Badge>
	);
}
