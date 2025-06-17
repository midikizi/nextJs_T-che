"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react"
import { useState } from "react"

export default function Query({children}:{
children : ReactNode
}){
    const [valeur] = useState(()=>new QueryClient);

    return <QueryClientProvider client={valeur}>{children}</QueryClientProvider>
}