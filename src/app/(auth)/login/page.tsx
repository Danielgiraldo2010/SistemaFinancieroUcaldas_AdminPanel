'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LifeBuoy } from "lucide-react"

export default function LoginPage() {

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    sessionStorage.clear()
    localStorage.clear()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (loading) return

    setError("")
    setLoading(true)

    try {

      const response = await fetch('/api/proxy/api/Authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {

        sessionStorage.setItem('userEmail', formData.email)

        if (data.requires2FA || data.user?.twoFactorEnabled) {
          router.push('/verify-2fa')
        } else {
          router.push('/dashboard')
        }

      } else {

        setError(data.message || "Credenciales incorrectas")

      }

    } catch (err) {

      setError("Error de conexión con el servidor")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="main-auth-container">

      <style jsx global>{`

        html, body{
          margin:0;
          padding:0;
          overflow:hidden;
          background:#004aad;
          font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
        }

        .bg-fixed-layer{
          position:fixed;
          inset:0;
          z-index:1;
        }

        .bg-kenburns{
          width:100%;
          height:100%;
          background:url("/images/Fondo_UCaldas.jpeg") center/cover no-repeat;
          animation:moveBg 25s infinite alternate ease-in-out;
        }

        @keyframes moveBg{
          from{transform:scale(1);}
          to{transform:scale(1.1);}
        }

        .blue-tint{
          position:absolute;
          inset:0;
          background:rgba(0,74,173,0.45);
          mix-blend-mode:multiply;
          z-index:2;
        }

        .u-caldas-logo{
          position:fixed;
          top:40px;
          left:50px;
          height:110px;
          z-index:10;
          filter:brightness(0) invert(1);
        }

        .cidt-logo-container{
          position:fixed;
          bottom:40px;
          left:50px;
          z-index:10;
        }

        .cidt-logo-img{
          height:110px;
          filter:drop-shadow(0 0 15px white);
        }

        .auth-card{
          position:fixed;
          right:10%;
          top:50%;
          transform:translateY(-50%);
          width:440px;
          background:white;
          border-radius:28px;
          padding:45px;
          box-shadow:0 40px 80px rgba(0,0,0,0.5);
          z-index:20;
        }

        .auth-header h2{
          font-size:28px;
          color:#1e293b;
          margin:0;
          font-weight:800;
          text-align:center;
        }

        .auth-header p{
          font-size:13px;
          color:#64748b;
          text-align:center;
          font-weight:700;
          text-transform:uppercase;
          margin-top:8px;
        }

        .form-input-group{
          margin-top:25px;
        }

        .label-style{
          font-size:11px;
          font-weight:800;
          color:#475569;
          text-transform:uppercase;
          margin-bottom:8px;
          display:block;
        }

        .input-style{
          width:100%;
          padding:16px;
          border:2px solid #e2e8f0;
          border-radius:12px;
          box-sizing:border-box;
          font-size:16px;
        }

        .input-style:focus{
          outline:none;
          border-color:#004aad;
          box-shadow:0 0 0 2px rgba(0,74,173,0.2);
        }

        .password-relative{
          position:relative;
        }

        .eye-button{
          position:absolute;
          right:15px;
          top:50%;
          transform:translateY(-50%);
          background:none;
          border:none;
          color:#94a3b8;
          cursor:pointer;
        }

        .submit-btn{
          width:100%;
          padding:18px;
          background:#004aad;
          color:white;
          border:none;
          border-radius:12px;
          font-weight:700;
          cursor:pointer;
          margin-top:30px;
          font-size:16px;
          transition:0.3s;
        }

        .submit-btn:hover{
          background:#003680;
        }

        .submit-btn:disabled{
          opacity:0.6;
          cursor:not-allowed;
        }

        .error-box{
          background:#ffe5e5;
          color:#b30000;
          padding:10px;
          border-radius:10px;
          text-align:center;
          margin-top:15px;
          font-size:14px;
        }

        .support-footer-link{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          margin-top:25px;
          font-size:12px;
          color:#004aad;
          text-decoration:none;
          font-weight:700;
        }

        @media (max-width:1024px){

          .u-caldas-logo{
            height:80px;
            top:20px;
            left:20px;
          }

          .auth-card{
            right:50%;
            left:50%;
            top:55%;
            transform:translate(-50%,-50%);
            width:90%;
            max-width:400px;
            padding:30px 20px;
          }

          .cidt-logo-container{
            bottom:auto;
            left:auto;
            top:20px;
            right:20px;
          }

          .cidt-logo-img{
            height:80px;
          }

        }

      `}</style>

      <div className="bg-fixed-layer">
        <div className="bg-kenburns"></div>
        <div className="blue-tint"></div>
      </div>

      <img
        src="/images/Logo2-u-caldas.png"
        className="u-caldas-logo"
        alt="Universidad de Caldas"
      />

      <div className="cidt-logo-container">
        <img
          src="/images/ci2dt2__2.png"
          className="cidt-logo-img"
          alt="CIDT"
        />
      </div>

      <div className="auth-card">

        <div className="auth-header">
          <h2>Sistema Financiero</h2>
          <p>Administración Central</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-input-group">
            <label className="label-style">Correo</label>

            <input
              className="input-style"
              type="email"
              placeholder="usuario@email.com"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value.trim()
                })
              }
            />
          </div>

          <div className="form-input-group">
            <label className="label-style">Contraseña</label>

            <div className="password-relative">

              <input
                className="input-style"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Ingresar al Portal"}
          </button>

        </form>

        <a
          href="mailto:soporte.sistemas@ucaldas.edu.co"
          className="support-footer-link"
        >
          <LifeBuoy size={16}/>
          Soporte Técnico Universidad de Caldas
        </a>

      </div>

    </div>

  )

}