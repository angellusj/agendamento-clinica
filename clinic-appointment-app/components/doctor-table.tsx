'use client'

import { Badge } from '@/components/ui/badge'
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
import { updateDoctor, deleteDoctor } from '@/app/actions/doctor'
import { useRouter } from 'next/navigation'

interface DoctorTableProps {
  doctors: Array<{
    id: number
    name: string
    crm: string
    specialtyName: string | null
    phone: string | null
    email: string
    active: boolean
  }>
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  const router = useRouter()

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    await updateDoctor(id, { active: !currentStatus })
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este médico?')) {
      await deleteDoctor(id)
      router.refresh()
    }
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum médico cadastrado
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CRM</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell className="font-medium">{doctor.name}</TableCell>
            <TableCell>{doctor.crm}</TableCell>
            <TableCell>{doctor.specialtyName || '-'}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {doctor.email}
                </div>
                {doctor.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {doctor.phone}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={doctor.active ? 'default' : 'secondary'}>
                {doctor.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleToggleActive(doctor.id, doctor.active)}>
                    {doctor.active ? 'Desativar' : 'Ativar'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(doctor.id)}
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
