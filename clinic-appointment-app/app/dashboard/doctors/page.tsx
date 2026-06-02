import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DoctorTable } from '@/components/doctor-table'
import { NewDoctorDialog } from '@/components/new-doctor-dialog'
import { getDoctors } from '@/app/actions/doctor'
import { getSpecialties } from '@/app/actions/specialty'

export default async function DoctorsPage() {
  const [doctors, specialties] = await Promise.all([
    getDoctors(),
    getSpecialties(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Médicos</h1>
          <p className="text-muted-foreground">
            Gerencie os médicos da clínica
          </p>
        </div>
        <NewDoctorDialog specialties={specialties} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Médicos</CardTitle>
          <CardDescription>
            {doctors.length} médico(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DoctorTable doctors={doctors} />
        </CardContent>
      </Card>
    </div>
  )
}
