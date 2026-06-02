import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientTable } from '@/components/patient-table'
import { NewPatientDialog } from '@/components/new-patient-dialog'
import { getPatients } from '@/app/actions/patient'

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">
            Gerencie os pacientes da clínica
          </p>
        </div>
        <NewPatientDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {patients.length} paciente(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientTable patients={patients} />
        </CardContent>
      </Card>
    </div>
  )
}
