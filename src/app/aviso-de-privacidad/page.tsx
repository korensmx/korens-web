export const metadata = { title: "Aviso de Privacidad | KORENS" };

export default function AvisoPrivacidad() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="max-w-2xl mx-auto space-y-6 leading-relaxed">
        <a href="/" className="text-orange-400 text-sm">← Volver al inicio</a>
        <h1 className="text-3xl sm:text-4xl font-black">Aviso de Privacidad</h1>
        <p className="text-slate-400 text-sm">Última actualización: 30 de septiembre de 2026</p>

        <h2 className="text-xl font-bold text-orange-400">¿Quién es el responsable?</h2>
        <p>
          KORENS, representada por Gerardo David Amador Segura, es responsable del tratamiento de tus datos personales.
          Contacto: contacto@korensmx.com
        </p>

        <h2 className="text-xl font-bold text-orange-400">¿Qué datos pedimos?</h2>
        <p>
          Tu nombre y tu correo electrónico cuando descargas un regalo o nos escribes. Si contratas un servicio, también
          la información profesional que nos compartas (por ejemplo, tu currículum).
        </p>

        <h2 className="text-xl font-bold text-orange-400">¿Para qué los usamos?</h2>
        <p>
          Para enviarte el regalo que pediste, mandarte una serie de 3 correos con consejos de empleabilidad y
          información de nuestros servicios, responder tus mensajes y prestarte el servicio que contrates.
        </p>

        <h2 className="text-xl font-bold text-orange-400">¿Con quién los compartimos?</h2>
        <p>
          No vendemos tus datos. Solo los manejan las herramientas que usamos para operar (envío de correos, pagos con
          Mercado Pago y atención por WhatsApp), únicamente para cumplir con lo anterior.
        </p>

        <h2 className="text-xl font-bold text-orange-400">Tus derechos</h2>
        <p>
          Puedes acceder a tus datos, corregirlos, cancelarlos u oponerte a su uso (derechos ARCO) escribiendo a
          contacto@korensmx.com. También puedes darte de baja de los correos en cualquier momento con el enlace de
          baja que aparece al final de cada mensaje.
        </p>

        <h2 className="text-xl font-bold text-orange-400">Cambios a este aviso</h2>
        <p>Si cambiamos este aviso, publicaremos la nueva versión en esta misma página.</p>
      </div>
    </main>
  );
}
