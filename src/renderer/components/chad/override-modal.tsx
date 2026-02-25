"use client"

import { useState } from "react"
import type { Quote } from "../../types/chad"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"

interface OverrideModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (justification: string) => void
  action: "exclude" | "restore"
  quote: Quote | null
}

export function OverrideModal({
  open,
  onClose,
  onConfirm,
  action,
  quote,
}: OverrideModalProps) {
  const [justification, setJustification] = useState("")

  const isExclude = action === "exclude"
  const title = isExclude ? "Excluir Cotacao Manualmente" : "Restaurar Cotacao"
  const description = isExclude
    ? "Informe a justificativa para exclusao desta cotacao. Esta informacao sera registrada na Nota Tecnica conforme IN 65/2021 Art. 3, V."
    : "Informe a justificativa para restaurar esta cotacao ao calculo."

  const handleConfirm = () => {
    if (justification.trim().length < 10) return
    onConfirm(justification.trim())
    setJustification("")
  }

  const handleClose = () => {
    setJustification("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {quote && (
          <div className="flex flex-col gap-1 rounded-md bg-muted p-3">
            <span className="text-sm font-medium text-foreground">
              {quote.fornecedorNome}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {quote.fornecedorCNPJ}
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {quote.valorAtualizado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="justification">
            Justificativa{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="justification"
            placeholder="Digite a justificativa (minimo 10 caracteres)..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
          />
          {justification.length > 0 && justification.trim().length < 10 && (
            <p className="text-xs text-destructive">
              A justificativa deve ter pelo menos 10 caracteres.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={justification.trim().length < 10}
            variant={isExclude ? "destructive" : "default"}
          >
            {isExclude ? "Confirmar Exclusao" : "Confirmar Restauracao"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
