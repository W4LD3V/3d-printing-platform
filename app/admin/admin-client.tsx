'use client';

import { useMutation, useQuery } from '@apollo/client';
import { FormEvent, useMemo, useState } from 'react';
import {
  ADD_COLOR_MUTATION,
  ADD_PLASTIC_MUTATION,
  ALL_ORDERS_QUERY,
  COLORS_QUERY,
  DELETE_COLOR_MUTATION,
  DELETE_PLASTIC_MUTATION,
  PLASTICS_QUERY,
  UPDATE_COLOR_MUTATION,
  UPDATE_ORDER_STATUS_MUTATION,
  UPDATE_PLASTIC_MUTATION
} from '@/lib/graphql/queries';

export default function AdminClient() {
  const { data: plasticsData, refetch: refetchPlastics } = useQuery<{ plastics: any[] }>(PLASTICS_QUERY);
  const { data: colorsData, refetch: refetchColors } = useQuery<{ colors: any[] }>(COLORS_QUERY);
  const { data: ordersData, refetch: refetchOrders } = useQuery<{ orders: any[] }>(ALL_ORDERS_QUERY);

  const [plasticForm, setPlasticForm] = useState({ name: '', pricePerGram: '0.2', description: '' });
  const [colorForm, setColorForm] = useState({ name: '', hex: '#A1A1A1' });

  const [addPlastic] = useMutation(ADD_PLASTIC_MUTATION);
  const [updatePlastic] = useMutation(UPDATE_PLASTIC_MUTATION);
  const [deletePlastic] = useMutation(DELETE_PLASTIC_MUTATION);

  const [addColor] = useMutation(ADD_COLOR_MUTATION);
  const [updateColor] = useMutation(UPDATE_COLOR_MUTATION);
  const [deleteColor] = useMutation(DELETE_COLOR_MUTATION);

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  const statuses = useMemo(
    () => [
      { value: 'PENDING', label: 'Pending', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
      { value: 'PROCESSING', label: 'Processing', badge: 'bg-sky-100 text-sky-800 border-sky-200' },
      { value: 'COMPLETED', label: 'Completed', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { value: 'CANCELLED', label: 'Cancelled', badge: 'bg-rose-100 text-rose-800 border-rose-200' }
    ],
    []
  );

  async function submitPlastic(e: FormEvent) {
    e.preventDefault();
    await addPlastic({ variables: { input: { ...plasticForm, pricePerGram: parseFloat(plasticForm.pricePerGram) } } });
    setPlasticForm({ name: '', pricePerGram: '0.2', description: '' });
    refetchPlastics();
  }

  async function submitColor(e: FormEvent) {
    e.preventDefault();
    await addColor({ variables: { input: { ...colorForm } } });
    setColorForm({ name: '', hex: '#A1A1A1' });
    refetchColors();
  }

  async function handleOrderStatus(id: string, status: string) {
    await updateOrderStatus({ variables: { id, status } });
    refetchOrders();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-midnight">Admin console</h1>

      <section className="glass rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Plastics</h2>
            <p className="text-sm text-slate-600">Manage materials and pricing.</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          <form onSubmit={submitPlastic} className="space-y-3 p-4 border rounded-lg bg-white">
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Name"
              value={plasticForm.name}
              onChange={(e) => setPlasticForm((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Description"
              value={plasticForm.description}
              onChange={(e) => setPlasticForm((v) => ({ ...v, description: e.target.value }))}
            />
            <input
              type="number"
              step="0.01"
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Price per gram"
              value={plasticForm.pricePerGram}
              onChange={(e) => setPlasticForm((v) => ({ ...v, pricePerGram: e.target.value }))}
            />
            <button className="bg-midnight text-white px-4 py-2 rounded-lg font-semibold">Add plastic</button>
          </form>
          <div className="space-y-3">
            {plasticsData?.plastics?.map((plastic) => (
              <div key={plastic.id} className="p-4 border rounded-lg bg-white flex items-center justify-between">
                <div>
                  <p className="font-semibold">{plastic.name}</p>
                  <p className="text-xs text-slate-600">${plastic.pricePerGram.toFixed(2)} / g</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    className={`px-3 py-1 rounded border ${
                      plastic.active
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                    onClick={() =>
                      updatePlastic({
                        variables: { id: plastic.id, input: { active: !plastic.active } }
                      }).then(() => refetchPlastics())
                    }
                  >
                    {plastic.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-50 text-red-600"
                    onClick={() => deletePlastic({ variables: { id: plastic.id } }).then(() => refetchPlastics())}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Colors</h2>
            <p className="text-sm text-slate-600">Manage available colors.</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          <form onSubmit={submitColor} className="space-y-3 p-4 border rounded-lg bg-white">
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="Name"
              value={colorForm.name}
              onChange={(e) => setColorForm((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="#HEX"
              value={colorForm.hex}
              onChange={(e) => setColorForm((v) => ({ ...v, hex: e.target.value }))}
              required
            />
            <button className="bg-midnight text-white px-4 py-2 rounded-lg font-semibold">Add color</button>
          </form>
          <div className="space-y-3">
            {colorsData?.colors?.map((color) => (
              <div key={color.id} className="p-4 border rounded-lg bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border" style={{ background: color.hex }} />
                  <div>
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-xs text-slate-600">{color.hex}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    className={`px-3 py-1 rounded border ${
                      color.available
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                    onClick={() =>
                      updateColor({ variables: { id: color.id, input: { available: !color.available } } }).then(() =>
                        refetchColors()
                      )
                    }
                  >
                    {color.available ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-50 text-red-600"
                    onClick={() => deleteColor({ variables: { id: color.id } }).then(() => refetchColors())}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="space-y-3">
          {ordersData?.orders?.map((order) => (
            <div
              key={order.id}
              className={`p-4 border rounded-lg bg-white ${
                order.userHidden ? 'opacity-70 ring-1 ring-amber-100' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{order.modelUrl}</p>
                  <p className="text-xs text-slate-600">{order.user.email}</p>
                </div>
                <select
                  className="border rounded-lg px-2 py-1 disabled:bg-slate-100 disabled:text-slate-500"
                  value={order.status}
                  disabled={order.userHidden}
                  onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 text-xs text-slate-600 mt-2">
                <span>{order.material.name}</span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border" style={{ background: order.color.hex }} />
                  {order.color.name}
                </span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeClass(
                    order.status,
                    statuses
                  )}`}
                >
                  {order.status}
                </span>
                {order.userHidden && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border border-amber-200 bg-amber-50 text-amber-800 ml-2">
                    Deleted by user
                  </span>
                )}
              </div>
              {order.userHidden && (
                <p className="text-xs text-slate-500 mt-2">Status updates disabled for deleted orders.</p>
              )}
              {order.notes && <p className="text-sm text-slate-700 mt-2">{order.notes}</p>}
            </div>
          ))}
          {!ordersData?.orders?.length && <p className="text-sm text-slate-500">No orders found.</p>}
        </div>
      </section>
    </div>
  );
}

function getBadgeClass(status: string, statuses: { value: string; badge: string }[]) {
  const matched = statuses.find((s) => s.value === status);
  return matched ? matched.badge : 'bg-slate-100 text-slate-700 border-slate-200';
}
