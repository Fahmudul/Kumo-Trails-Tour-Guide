import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getServerSession } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiMenuFries } from "react-icons/ci";
import logo from "../../public/avatar.jpeg";
import Image from "next/image";
import { GiAirplaneDeparture } from "react-icons/gi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import Button from "./Button";
const Navbar = async () => {
  const Navlink = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "/community",
      name: "Community",
    },
    {
      path: "/blogs",
      name: "Blogs",
    },
    {
      path: "/about-us",
      name: "About Us",
    },
    {
      path: "/contact-us",
      name: "Contact ",
    },
  ];
  // const { data: session } = useSession();
  const session = await getServerSession(authOptions);
  console.log("from line 49", session);
  return (
    <div>
      <div className="container mx-auto">
        <nav className="flex items-center my-5">
          <div className=" flex items-center">
            <GiAirplaneDeparture className="text-6xl" />
            <p className="font-indie text-4xl ">Kumo Trails</p>
          </div>
          <ul className="flex mx-3 flex-1 justify-center">
            {Navlink.map((link, idx) => (
              <Link key={idx} href={link.path} className="mr-5">
                {link.name}
              </Link>
            ))}
          </ul>
          {/**Profile icon, Log in, Log Out */}
          {session ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Image
                    alt="user profile"
                    src={session?.user?.image! || logo}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/sign-in" className="p-2 border rounded-full">
              Log in
            </Link>
          )}
        </nav>
      </div>
      {/**Mobile navbar */}

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="absolute right-2 top-2">
            <CiMenuFries className="text-2xl" />
          </SheetTrigger>
          <SheetContent className="bg-red-500">
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
