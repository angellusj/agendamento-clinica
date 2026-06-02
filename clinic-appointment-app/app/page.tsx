import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Calendar, Users, UserCog, ArrowRight } from 'lucide-react'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ClinicaApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Sistema de Agendamentos
              <br />
              <span className="text-primary">para Clínicas Médicas</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Gerencie agendamentos, pacientes e médicos de forma simples e eficiente.
              Desenvolvido com os princípios da Orientação a Objetos.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Funcionalidades Principais
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl p-6 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Agendamentos</h3>
                <p className="text-muted-foreground text-sm">
                  Gerencie consultas com visualização de calendário e controle de status
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Pacientes</h3>
                <p className="text-muted-foreground text-sm">
                  Cadastro completo de pacientes com informações de contato e convênio
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Médicos</h3>
                <p className="text-muted-foreground text-sm">
                  Controle de profissionais por especialidade com gestão de disponibilidade
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Especialidades</h3>
                <p className="text-muted-foreground text-sm">
                  Organize médicos por especialidade para facilitar os agendamentos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OOP Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Arquitetura Orientada a Objetos
              </h2>
              <p className="text-muted-foreground mb-8">
                Este sistema foi desenvolvido seguindo os princípios fundamentais da
                Programação Orientada a Objetos:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-1">Encapsulamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados e comportamentos agrupados em classes bem definidas
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-1">Abstração</h4>
                  <p className="text-sm text-muted-foreground">
                    Interfaces simplificadas que escondem complexidade interna
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-1">Herança</h4>
                  <p className="text-sm text-muted-foreground">
                    Tipos compartilham características através de hierarquias
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-1">Polimorfismo</h4>
                  <p className="text-sm text-muted-foreground">
                    Status de agendamento com diferentes comportamentos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>ClinicaApp - Sistema de Agendamentos</p>
        </div>
      </footer>
    </div>
  )
}
