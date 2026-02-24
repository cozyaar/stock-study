import { useState, useEffect } from 'react';

export interface Position {
    symbol: string;
    qty: number;
    avgPrice: number;
}

let globalCash = 500000;
let globalPositions: Record<string, Position> = {};
let globalActiveSymbol: string | null = null;
const listeners: Set<() => void> = new Set();

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const useDemoStore = () => {
    const [, setTick] = useState(0);

    useEffect(() => {
        const update = () => setTick(t => t + 1);
        listeners.add(update);
        return () => { listeners.delete(update); };
    }, []);

    const setCash = (newCash: number | ((c: number) => number)) => {
        globalCash = typeof newCash === 'function' ? newCash(globalCash) : newCash;
        emitChange();
    };

    const setPositions = (newPositions: Record<string, Position> | ((p: Record<string, Position>) => Record<string, Position>)) => {
        globalPositions = typeof newPositions === 'function' ? newPositions(globalPositions) : newPositions;
        emitChange();
    };

    const setActiveSymbol = (symbol: string | null) => {
        globalActiveSymbol = symbol;
        emitChange();
    };

    return { cash: globalCash, setCash, positions: globalPositions, setPositions, activeSymbol: globalActiveSymbol, setActiveSymbol };
};
