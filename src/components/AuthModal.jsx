import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaGoogle, FaFacebook, FaEnvelope } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleOAuthLogin = async (provider) => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin, // Redirige a la misma página
                }
            });
            if (error) throw error;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLinkLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                }
            });
            if (error) throw error;
            setIsEmailSent(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-volcanic-black border border-soft-gold/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-off-white/50 hover:text-soft-gold text-2xl transition-colors"
                >
                    &times;
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-soft-gold mb-2">Bienvenido a Vecy</h2>
                    <p className="text-off-white/70 text-sm">Inicia sesión para autocompletar tus datos y agilizar tu solicitud.</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 text-red-200 text-sm p-3 rounded-lg mb-6 border border-red-500/30">
                        {error}
                    </div>
                )}

                {isEmailSent ? (
                    <div className="text-center bg-esmeralda/20 border border-esmeralda p-6 rounded-xl">
                        <div className="text-4xl mb-4">📧</div>
                        <h3 className="text-xl font-bold text-off-white mb-2">¡Revisa tu correo!</h3>
                        <p className="text-off-white/80">Hemos enviado un enlace mágico a <strong>{email}</strong>.</p>
                        <p className="text-sm text-off-white/60 mt-4">Haz clic en el enlace para entrar automáticamente.</p>
                        <button
                            onClick={() => setIsEmailSent(false)}
                            className="mt-6 text-soft-gold hover:underline text-sm"
                        >
                            Volver a intentar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <FaGoogle className="text-red-500 text-xl" />
                            Continuar con Google
                        </button>

                        <button
                            onClick={() => handleOAuthLogin('facebook')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#166fe5] transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <FaFacebook className="text-xl" />
                            Continuar con Facebook
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-off-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-volcanic-black text-off-white/50">O usa tu correo</span>
                            </div>
                        </div>

                        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-off-white/80">Correo Electrónico</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-off-white/30" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tucorreo@ejemplo.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-off-white/20 rounded-xl text-off-white placeholder-off-white/30 focus:border-soft-gold focus:ring-1 focus:ring-soft-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-soft-gold/80 hover:bg-soft-gold text-volcanic-black font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-luminous-gold"
                            >
                                {loading ? 'Enviando...' : 'Enviar enlace de acceso al correo'}
                            </button>
                        </form>
                        <p className="text-xs text-center text-off-white/40 mt-2">
                            * Te enviaremos un link a tu correo para entrar sin contraseña.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
