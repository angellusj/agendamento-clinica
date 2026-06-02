'use client'

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
import { MoreHorizontal } from 'lucide-react'
import { deleteSpecialty } from '@/app/actions/specialty'
import { useRouter } from 'next/navigation'
import type { Specialty } from '@/lib/db/schema'

interface SpecialtyTableProps {
  specialties: Specialty[]
}

export function SpecialtyTable({ specialties }: SpecialtyTableProps) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta especialidade?')) {
      await deleteSpecialty(id)
      router.refresh()
    }
  }

  if (specialties.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma especialidade cadastrada
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specialties.map((specialty) => (
          <TableRow key={specialty.id}>
            <TableCell className="font-medium">{specialty.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {specialty.description || '-'}
            </TableCell>
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
                    onClick={() => handleDelete(specialty.id)}
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
