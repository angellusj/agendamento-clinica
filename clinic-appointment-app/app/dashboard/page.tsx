import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Users, UserCog, Calendar, CalendarCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/stats-card'
import { getDashboardStats, getUpcomingAppointments, getTodayAppointments } from '@/app/actions/appointment'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const upcoming = await getUpcomingAppointments(5)
  const today = await getTodayAppointments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de agendamentos da clínica
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Pacientes"
          value={stats.totalPatients}
          description="Pacientes cadastrados"
          icon={Users}
        />
        <StatsCard
          title="Total de Médicos"
          value={stats.totalDoctors}
          description="Médicos ativos"
          icon={UserCog}
        />
        <StatsCard
          title="Consultas Hoje"
          value={stats.todayAppointments}
          description={format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          icon={Calendar}
        />
        <StatsCard
          title="Total de Consultas"
          value={stats.totalAppointments}
          description="Agendamentos realizados"
          icon={CalendarCheck}
        />
      </div>

      {/* Grid with Today's and Upcoming appointments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas de Hoje</CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {today.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Nenhuma consulta agendada para hoje
              </p>
            ) : (
              <div className="space-y-4">
                {today.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {apt.dateTime ? format(new Date(apt.dateTime), 'HH:mm') : '--:--'}
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.doctorName} - {apt.specialtyName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={apt.status === 'confirmed' ? 'default' : 'outline'}
                    >
                      {apt.status === 'scheduled' && 'Agendado'}
                      {apt.status === 'confirmed' && 'Confirmado'}
                      {apt.status === 'in_progress' && 'Em Atendimento'}
                      {apt.status === 'completed' && 'Concluído'}
                      {apt.status === 'cancelled' && 'Cancelado'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Agendamentos futuros</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Nenhuma consulta agendada
              </p>
            ) : (
              <div className="space-y-4">
                {upcoming.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          {apt.dateTime ? format(new Date(apt.dateTime), 'dd MMM', { locale: ptBR }) : '--'}
                        </p>
                        <p className="font-semibold">
                          {apt.dateTime ? format(new Date(apt.dateTime), 'HH:mm') : '--:--'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.doctorName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.specialtyName}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
