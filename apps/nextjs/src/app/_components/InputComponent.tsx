"use client";

import { useState } from "react";

interface IInputComponentProps {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<string | null>;
  compute: (key: string, value: string) => Promise<string | null>;
}
const InputComponent = ({ get, set, compute }: IInputComponentProps) => {
  const [getKey, setGetKey] = useState<string>();
  const [setKey, setSetKey] = useState<string>();
  const [setValue, setSetValue] = useState<string>();
  const [computeKey, setComputeKey] = useState<string>();
  const [computeValue, setComputeValue] = useState<string>();

  const [getValue, setGetValue] = useState<string>();
  const [returnedSetValue, setReturnedSetValue] = useState<string>();
  const [computedValue, setComputedValue] = useState<string>();

  async function _get(key?: string) {
    if (!key) return;
    const val = await get(key);
    setGetValue(val ?? undefined);
  }
  async function _set(key?: string, value?: string) {
    if (!key || !value) return;
    const val = await set(key, value);
    setReturnedSetValue(val ?? undefined);
  }
  async function _compute(key?: string, value?: string) {
    if (!key || !value) return;
    const val = await compute(key, value);
    setComputedValue(val ?? undefined);
  }

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex w-1/3 flex-col items-center justify-center gap-2 rounded-md border border-white p-4">
        <div className="w-full p-4 text-xl font-bold">Set Key</div>
        {setKey && (
          <div>
            Value for {setKey} is {returnedSetValue ?? "Unset"}
          </div>
        )}
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Key</div>
          <input
            className="rounded-md bg-slate-400 p-2"
            value={setKey}
            onChange={(e) => setSetKey(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Value</div>
          <input
            className="rounded-md bg-slate-400 p-2"
            value={setValue}
            onChange={(e) => setSetValue(e.target.value)}
          />
        </div>
        <button
          className="min-w-24 rounded-md bg-slate-600 p-2"
          onClick={() => _set(setKey, setValue)}
          disabled={!setKey || !setValue}
        >
          Set
        </button>
      </div>

      <div className="flex w-1/3 flex-col items-center justify-center gap-2 rounded-md border border-white p-4">
        <div className="w-full p-4 text-xl font-bold">Compute Key</div>
        {computeKey && (
          <div>
            Value for {computeKey} is {computedValue ?? "Unset"}
          </div>
        )}
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Key</div>
          <input
            className="rounded-md bg-slate-400 p-2"
            value={computeKey}
            onChange={(e) => setComputeKey(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Value</div>
          <input
            type="number"
            className="rounded-md bg-slate-400 p-2"
            value={computeValue}
            onChange={(e) => setComputeValue(e.target.value)}
          />
        </div>
        <button
          className="min-w-24 rounded-md bg-slate-600 p-2"
          disabled={!computeKey || !computeValue}
          onClick={() => _compute(computeKey, computeValue)}
        >
          Compute
        </button>
      </div>

      <div className="flex w-1/3 flex-col items-center justify-center gap-2 rounded-md border border-white p-4">
        <div className="w-full p-4 text-xl font-bold">Get Key</div>
        {getKey && (
          <div>
            Value for {getKey} is {getValue ?? "Unset"}
          </div>
        )}
        <input
          className="rounded-md bg-slate-400 p-2"
          value={getKey}
          onChange={(e) => setGetKey(e.target.value)}
        />
        <button
          className="min-w-24 rounded-md bg-slate-600 p-2"
          disabled={!getKey}
          onClick={() => _get(getKey)}
        >
          Get
        </button>
      </div>
    </div>
  );
};

export default InputComponent;
