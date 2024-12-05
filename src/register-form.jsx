import React from "react";
import Image from "./components/ui/Image";
import Link from "./components/ui/Link";
import { User, Mail, Lock, KeyRound } from 'lucide-react';

import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

export default function Register() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-8 p-8 bg-gray-800">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-8">Sign up</h1>
        </div>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                Your Name
              </div>
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                Your Email
              </div>
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              required
              type="email"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-400" />
                Password
              </div>
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-gray-400" />
                Repeat your password
              </div>
            </Label>
            <Input
              id="confirm-password"
              placeholder="Repeat your password"
              required
              type="password"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" className="border-gray-400 data-[state=checked]:bg-blue-500" />
            <Label htmlFor="terms" className="text-white">
              I agree all statements in{" "}
              <Link href="#" className="text-blue-400 hover:underline">
                Terms of service
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            REGISTER
          </Button>
        </form>
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <Image
          src="https://www.itca.edu.sv/wp-content/themes/elaniin-itca/images/logoColor.png"
          alt="Sign up illustration"
          width={500}
          height={400}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

