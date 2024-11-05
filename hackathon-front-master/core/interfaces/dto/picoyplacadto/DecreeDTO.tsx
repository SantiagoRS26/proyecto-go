'use client';
import { Dispatch, SetStateAction } from "react";

export interface DecreeDTO {
    decreeName: string;
    setDecreeName: Dispatch<SetStateAction<string>>;
}
