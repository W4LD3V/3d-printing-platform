'use client';

import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import {
  COLORS_QUERY,
  CREATE_ORDER_MUTATION,
  DELETE_ORDER_MUTATION,
  MY_ORDERS_QUERY,
  PLASTICS_QUERY
} from '@/lib/graphql/queries';
import { graphQLFetcher } from '@/lib/graphql/fetcher';

export default function OrdersClient() {
  const { data: plasticsData } = useQuery<{ plastics: any[] }>(PLASTICS_QUERY);
  const { data: colorsData } = useQuery<{ colors: any[] }>(COLORS_QUERY);
  const { data: ordersData, mutate } = useSWR<{ myOrders: any[] }>('myOrders', () =>
    graphQLFetcher<{ myOrders: any[] }>(MY_ORDERS_QUERY)
  );

  const [modelUrl, setModelUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPlastic, setSelectedPlastic] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [createOrder, { loading }] = useMutation(CREATE_ORDER_MUTATION);
  const [deleteOrder, { loading: deleting }] = useMutation(DELETE_ORDER_MUTATION);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createOrder({
      variables: {
        input: {
          modelUrl,
          notes,
          materialId: selectedPlastic,
          colorId: selectedColor
        }
      }
    });
    setModelUrl('');
    setNotes('');
    await mutate();
  }

  return (
    <div className="space-y-8">
      <section className="glass rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold text-midnight mb-2">Create a print order</h1>
        <p className="text-sm text-slate-600 mb-4">
          Paste a link to your STL/OBJ file and choose material + color.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Model URL</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="https://example.com/part.stl"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Plastic</label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                value={selectedPlastic}
                onChange={(e) => setSelectedPlastic(e.target.value)}
                required
              >
                <option value="">Select material</option>
                {plasticsData?.plastics
                  ?.filter((p) => p.active)
                  .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.pricePerGram.toFixed(2)}/g)
                  </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                required
              >
                <option value="">Select color</option>
                {colorsData?.colors
                  ?.filter((c) => c.available)
                  .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tolerances, infill preferences, or finishing notes."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-midnight text-white px-4 py-3 rounded-lg font-semibold hover:translate-y-[-1px] transition"
          >
            {loading ? 'Submitting…' : 'Submit order'}
          </button>
        </form>
      </section>

      <section className="glass rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold text-midnight mb-3">Your orders</h2>
        <div className="space-y-3">
          {ordersData?.myOrders?.map((order) => (
            <article key={order.id} className="p-4 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-midnight">{order.material.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-semibold ${getBadgeClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{order.modelUrl}</p>
              <div className="flex gap-3 text-xs text-slate-600 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border" style={{ background: order.color.hex }} />
                  {order.color.name}
                </span>
                <span>Submitted {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  className={`text-xs ${canDelete(order.status) ? 'text-red-600 hover:text-red-700' : 'text-slate-400'}`}
                  disabled={deleting || !canDelete(order.status)}
                  onClick={async () => {
                    if (!canDelete(order.status)) return;
                    await deleteOrder({ variables: { id: order.id } });
                    await mutate();
                  }}
                >
                  Delete order
                </button>
              </div>
              {order.notes && <p className="text-sm text-slate-700 mt-2">{order.notes}</p>}
            </article>
          ))}
          {!ordersData?.myOrders?.length && <p className="text-sm text-slate-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
}

function getBadgeClass(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'PROCESSING':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function canDelete(status: string) {
  return status === 'PENDING';
}
