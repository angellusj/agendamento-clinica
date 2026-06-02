import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SpecialtyTable } from '@/components/specialty-table'
import { NewSpecialtyDialog } from '@/components/new-specialty-dialog'
import { getSpecialties } from '@/app/actions/specialty'

export default async function SpecialtiesPage() {
  const specialties = await getSpecialties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Especialidades</h1>
          <p className="text-muted-foreground">
            Gerencie as especialidades médicas
          </p>
        </div>
        <NewSpecialtyDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Especialidades</CardTitle>
          <CardDescription>
            {specialties.length} especialidade(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpecialtyTable specialties={specialties} />
        </CardContent>
      </Card>
    </div>
  )
}
