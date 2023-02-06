import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://mingdx.github.io",
  author: "mindx",
  desc: "Awaken the Monster Inside",
  title: "Mind Chronicles",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/mingdx",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://fb.com",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
];
