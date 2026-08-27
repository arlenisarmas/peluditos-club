import { SOCIAL_LINKS } from "@/lib/social";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";

const LINKS = [
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export function SocialLinks({
  className = "",
  iconClassName = "h-5 w-5",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-brand-gray transition-colors hover:text-brand-black"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
