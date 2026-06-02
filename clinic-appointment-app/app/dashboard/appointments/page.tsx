import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentTable } from '@/components/appointment-table'
import { NewAppointmentDialog } from '@/components/new-appointment-dialog'
import { getAppointments } from '@/app/actions/appointment'
import { getPatients } from '@/app/actions/patient'
import { getActiveDoctors } from '@/app/actions/doctor'

export default async function AppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    getAppointments(),
    getPatients(),
    getActiveDoctors(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie as consultas da clínica
          </p>
        </div>
        <NewAppointmentDialog patients={patients} doctors={doctors} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
          <CardDescription>
            {appointments.length} agendamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentTable appointments={appointments} />
        </CardContent>
      </Card>
    </div>
  )
}
