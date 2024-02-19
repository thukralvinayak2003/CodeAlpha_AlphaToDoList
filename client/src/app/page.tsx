"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function Home() {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="bg-blue-400 p-14 rounded-lg shadow-lg">
          <h5 className="text-4xl font-bold text-white text-pretty font-black  ">
            Alpha To-Do List
          </h5>
          <div className="space-x-10">
            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline my-8 p-5 px-10">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline  my-8 p-5 px-10 ml-3">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
