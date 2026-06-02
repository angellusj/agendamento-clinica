'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
import { MoreHorizontal, CheckCircle, XCircle, Clock, Play, AlertCircle } from 'lucide-react'
import { updateAppointmentStatus, deleteAppointment } from '@/app/actions/appointment'
import { useRouter } from 'next/navigation'
import { AppointmentStatus } from '@/lib/db/schema'

interface AppointmentTableProps {
  appointments: Array<{
    id: number
    patientName: string | null
    patientPhone: string | null
    doctorName: string | null
    specialtyName: string | null
    dateTime: Date | null
    duration: number
    status: string
    notes: string | null
  }>
}

const statusConfig = {
  scheduled: { label: 'Agendado', variant: 'outline' as const, icon: Clock },
  confirmed: { label: 'Confirmado', variant: 'default' as const, icon: CheckCircle },
  in_progress: { label: 'Em Atendimento', variant: 'secondary' as const, icon: Play },
  completed: { label: 'Concluído', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle },
  no_show: { label: 'Não Compareceu', variant: 'destructive' as const, icon: AlertCircle },
}

export function AppointmentTable({ appointments }: AppointmentTableProps) {
  const router = useRouter()

  const handleStatusChange = async (id: number, status: string) => {
    await updateAppointmentStatus(id, status as typeof AppointmentStatus[keyof typeof AppointmentStatus])
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteAppointment(id)
      router.refresh()
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum agendamento encontrado
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Médico</TableHead>
          <TableHead>Especialidade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt) => {
          const config = statusConfig[apt.status as keyof typeof statusConfig] || statusConfig.scheduled
          const StatusIcon = config.icon

          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {apt.dateTime ? format(new Date(apt.dateTime), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {apt.dateTime ? format(new Date(apt.dateTime), "HH:mm", { locale: ptBR }) : '-'} - {apt.duration}min
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{apt.patientName || '-'}</p>
                  <p className="text-sm text-muted-foreground">{apt.patientPhone || '-'}</p>
                </div>
              </TableCell>
              <TableCell>{apt.doctorName || '-'}</TableCell>
              <TableCell>{apt.specialtyName || '-'}</TableCell>
              <TableCell>
                <Badge variant={config.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
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
                    <DropdownMenuItem onClick={() => handleStatusChange(apt.id, 'confirmed')}>
                      Confirmar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(apt.id, 'in_progress')}>
                      Iniciar Atendimento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(apt.id, 'completed')}>
                      Concluir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(apt.id, 'cancelled')}>
                      Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(apt.id, 'no_show')}>
                      Não Compareceu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(apt.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
