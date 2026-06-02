'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Mail, Phone } from 'lucide-react'
import { deletePatient } from '@/app/actions/patient'
import { useRouter } from 'next/navigation'
import type { Patient } from '@/lib/db/schema'

interface PatientTableProps {
  patients: Patient[]
}

export function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      await deletePatient(id)
      router.refresh()
    }
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum paciente cadastrado
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Data Nasc.</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Convênio</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.cpf}</TableCell>
            <TableCell>
              {patient.birthDate
                ? format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: ptBR })
                : '-'}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {patient.phone}
                </div>
                {patient.email && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{patient.healthInsurance || '-'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(patient.id)}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
