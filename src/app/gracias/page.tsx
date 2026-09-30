export const metadata = { title: "¡Gracias por tu compra! | KORENS" };

export default function Gracias({ searchParams }: { searchParams: { estado?: string } }) {
  const pendiente = searchParams?.estado === "pendiente";
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="text-6xl">{pendiente ? "⏳" : "🎉"}</div>
        <h1 className="text-3xl sm:text-4xl font-black">
          {pendiente ? "Tu pago está en proceso" : "¡Gracias por tu compra!"}
        </h1>
        <p className="text-slate-300 leading-relaxed">
          {pendiente
            ? "En cuanto Mercado Pago lo confirme, empezamos a trabajar en tu solicitud. No tienes que hacer nada más."
            : "Recibimos tu pago y ya estamos procesando tu solicitud. Es un gusto acompañarte en este paso de tu carrera."}
        </p>
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 text-left text-sm space-y-2">
          <p className="font-bold text-orange-400">¿Qué sigue?</p>
          <p>1. Te llegará un correo de confirmación con el resumen de tu compra.</p>
          <p>2. Nuestro equipo revisa tu información y prepara tus entregables.</p>
          <p>3. Si agendaste una sesión, recibirás recordatorios por WhatsApp antes de la videollamada.</p>
          <p>4. Cuando tu CV esté listo, te preguntaremos si deseas incluir una foto (nosotros no editamos fotografías).</p>
        </div>
        <a href="/" className="inline-block rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3">Volver al inicio</a>
        <p className="text-xs text-slate-500">¿Dudas? Escríbenos a contacto@korens.com.mx</p>
      </div>
    </main>
  );
}
