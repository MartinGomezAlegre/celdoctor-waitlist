"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ToastType, AdminBeneficiario, AdminUsuario, AdminUsuarioDetalle } from "../types";
import { API, authHeaders, fmtDate } from "../lib";
import { TableSkeleton } from "./shared/Skeleton";
import { ActiveDot, StatBadge } from "./shared/StatBadge";

type Filtro = "todos" | "activos" | "inactivos" | "con_plan" | "sin_plan";

interface Props {
  token: string;
  addToast: (msg: string, type: ToastType) => void;
}

function situacionUsuario(usuario: AdminUsuario): string {
  return usuario.estado_suscripcion ?? "sin_plan";
}

export default function SectionPersonas({ token, addToast }: Props) {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [buscar, setBuscar] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const [drawerUsuario, setDrawerUsuario] = useState<AdminUsuario | null>(null);
  const [drawerDetalle, setDrawerDetalle] = useState<AdminUsuarioDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [modalBaja, setModalBaja] = useState<AdminUsuario | null>(null);
  const [motivoBaja, setMotivoBaja] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`${API}/admin/usuarios`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setUsuarios(data as AdminUsuario[]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const filtrados = usuarios.filter((u) => {
    const q = buscar.toLowerCase();
    const matchBuscar =
      !q ||
      u.nombre.toLowerCase().includes(q) ||
      u.apellido.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    let matchFiltro = true;
    if (filtro === "activos") matchFiltro = u.activo;
    else if (filtro === "inactivos") matchFiltro = !u.activo;
    else if (filtro === "con_plan") matchFiltro = !!u.estado_suscripcion;
    else if (filtro === "sin_plan") matchFiltro = !u.estado_suscripcion;

    return matchBuscar && matchFiltro;
  });

  async function cambiarEstadoUsuario(usuario: AdminUsuario, activo: boolean) {
    setProcesando(true);
    try {
      const res = await fetch(`${API}/admin/usuarios/${usuario.id}/estado`, {
        method: "PUT",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body: JSON.stringify({ activo, motivo: motivoBaja }),
      });
      if (!res.ok) throw new Error();
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, activo } : u))
      );
      if (drawerUsuario?.id === usuario.id) {
        setDrawerUsuario((prev) => (prev ? { ...prev, activo } : prev));
      }
      if (drawerDetalle?.id === usuario.id) {
        setDrawerDetalle((prev) => (prev ? { ...prev, activo } : prev));
      }
      addToast(
        activo
          ? `${usuario.nombre} ${usuario.apellido} dado de alta correctamente.`
          : `${usuario.nombre} ${usuario.apellido} dado de baja correctamente.`,
        "success"
      );
    } catch {
      addToast("Error al cambiar el estado del usuario.", "error");
    } finally {
      setProcesando(false);
      setModalBaja(null);
      setMotivoBaja("");
    }
  }

  async function abrirDetalleUsuario(usuario: AdminUsuario) {
    setDrawerUsuario(usuario);
    setDrawerDetalle(null);
    setLoadingDetalle(true);

    try {
      const res = await fetch(`${API}/admin/usuarios/${usuario.id}`, {
        headers: authHeaders(token),
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = (await res.json()) as AdminUsuarioDetalle;
      setDrawerDetalle(data);
    } catch {
      addToast("No pudimos cargar el detalle completo del usuario.", "warning");
    } finally {
      setLoadingDetalle(false);
    }
  }

  const usuarioDetalle = drawerDetalle ?? drawerUsuario;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personas &amp; Familias</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 w-72"
          />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="todos">Todos</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
            <option value="con_plan">Con plan</option>
            <option value="sin_plan">Sin plan</option>
          </select>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        {error ? (
          <div className="m-6 rounded-xl bg-red-50 border border-red-200 px-6 py-4 text-red-700 font-medium">
            Error al cargar usuarios.
          </div>
        ) : loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Situacion",
                    "Nombre",
                    "Email",
                    "DNI",
                    "Telefono",
                    "Rol",
                    "Registro",
                    "Acciones",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No se encontraron usuarios.
                    </td>
                  </tr>
                ) : (
                  filtrados.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <StatBadge estado={situacionUsuario(u)} />
                          {!u.activo && (
                            <p className="text-[11px] font-medium text-red-500">Cuenta inactiva</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        <div>
                          <p>{u.nombre} {u.apellido}</p>
                          <p className="text-xs text-slate-400 font-normal">
                            {u.plan_nombre ?? "Sin plan asignado"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.dni ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.telefono}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 capitalize">
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {fmtDate(u.created_at)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => void abrirDetalleUsuario(u)}
                            className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                          >
                            Ver detalle
                          </button>
                          <button
                            onClick={() => {
                              setMotivoBaja("");
                              setModalBaja(u);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                              u.activo
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {u.activo ? "Dar de baja" : "Dar de alta"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerUsuario !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => {
              setDrawerUsuario(null);
              setDrawerDetalle(null);
            }}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {usuarioDetalle?.nombre} {usuarioDetalle?.apellido}
              </h2>
              <button
                onClick={() => {
                  setDrawerUsuario(null);
                  setDrawerDetalle(null);
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 px-6 py-6 space-y-6">
              {loadingDetalle && (
                <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                  Cargando informacion completa del usuario...
                </div>
              )}

              {/* Avatar */}
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white text-xl font-bold select-none">
                  {usuarioDetalle?.nombre.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {[
                  {
                    label: "Nombre completo",
                    value: `${usuarioDetalle?.nombre} ${usuarioDetalle?.apellido}`,
                  },
                  { label: "Email", value: usuarioDetalle?.email },
                  { label: "DNI", value: usuarioDetalle?.dni ?? "—" },
                  { label: "Telefono", value: usuarioDetalle?.telefono || "—" },
                  {
                    label: "Fecha de nacimiento",
                    value: usuarioDetalle?.fecha_nacimiento ? fmtDate(usuarioDetalle.fecha_nacimiento) : "—",
                  },
                  { label: "Rol", value: usuarioDetalle?.rol },
                  {
                    label: "Registro",
                    value: usuarioDetalle?.created_at ? fmtDate(usuarioDetalle.created_at) : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {label}
                    </span>
                    <span className="text-sm text-gray-800 break-all">
                      {value}
                    </span>
                  </div>
                ))}

                {/* Situacion */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Situacion comercial
                  </span>
                  <div className="flex items-center gap-2">
                    <StatBadge estado={situacionUsuario(usuarioDetalle as AdminUsuario)} />
                    {usuarioDetalle?.plan_nombre && (
                      <span className="text-sm text-gray-600">{usuarioDetalle.plan_nombre}</span>
                    )}
                  </div>
                </div>

                {/* Estado */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Estado de cuenta
                  </span>
                  <ActiveDot activo={!!usuarioDetalle?.activo} />
                </div>

                {"beneficiarios" in (usuarioDetalle ?? {}) && ((usuarioDetalle as AdminUsuarioDetalle).max_beneficiarios ?? 0) > 1 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Integrantes del plan familiar
                    </span>

                    {(usuarioDetalle as AdminUsuarioDetalle).beneficiarios.length > 0 ? (
                      <div className="space-y-2">
                        {(usuarioDetalle as AdminUsuarioDetalle).beneficiarios.map((beneficiario: AdminBeneficiario) => (
                          <div key={beneficiario.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-sm font-medium text-slate-900">
                              {beneficiario.nombre} {beneficiario.apellido}
                            </p>
                            <p className="text-xs text-slate-500">
                              {beneficiario.relacion} · DNI {beneficiario.dni}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Este usuario todavia no cargo integrantes adicionales.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setMotivoBaja("");
                  if (drawerUsuario) {
                    setModalBaja(drawerUsuario);
                  }
                }}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  usuarioDetalle?.activo
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {usuarioDetalle?.activo ? "Dar de baja" : "Dar de alta"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal baja / alta */}
      {modalBaja !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {modalBaja.activo ? "Dar de baja" : "Dar de alta"} a{" "}
              {modalBaja.nombre} {modalBaja.apellido}
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Motivo{" "}
                <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <textarea
                rows={3}
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                placeholder="Indica el motivo..."
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                disabled={procesando}
                onClick={() => {
                  setModalBaja(null);
                  setMotivoBaja("");
                }}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                disabled={procesando}
                onClick={() => cambiarEstadoUsuario(modalBaja, !modalBaja.activo)}
                className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                  modalBaja.activo
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {procesando ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
