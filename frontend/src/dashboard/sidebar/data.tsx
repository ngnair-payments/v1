import { LandmarkIcon } from "./icons/LandmarkIcon";
// import { FileIcon } from "./icons/FileIcon";
import { UsersIcon } from "./icons/UsersIcon";
// import { BagIcon } from "./icons/BagIcon";
// import { PackageIcon } from "./icons/PackageIcon";

type MenuItems = {
  section: string;
  icon: React.ReactNode;
  link?: string;
  content?: Array<Record<string, string>>;
};

export const publicOnly: MenuItems[] = [
  {
    section: "Dashboard",
    icon: <LandmarkIcon />,
    link: "/",
  },
];

export const authOnly: MenuItems[] = [
  {
    section: "Merchants",
    icon: <UsersIcon />,
    content: [
      {
        title: "Create Account",
        link: "/create-account",
      },
    ],
  },
];

// export const data = [
//   {
//     section: "Dashboard",
//     icon: <LandmarkIcon />,
//     link: "/",
//   },
//   {
//     section: "Reporting",
//     icon: <FileIcon />,
//     link: "/",
//   },
//   {
//     section: "Costumers",
//     icon: <UsersIcon />,
//     link: "/",
//   },
//   {
//     section: "Catalog",
//     icon: <BagIcon />,
//     link: "/",
//   },
//   {
//     section: "More",
//     icon: <PackageIcon />,
//     content: [
//       {
//         title: "Accounts",
//         link: "/more/accounts",
//       },
//       {
//         title: "Admin",
//         link: "/more/admin",
//       },
//       {
//         title: "Support",
//         link: "/more/support",
//       },
//     ],
//   },
// ];
