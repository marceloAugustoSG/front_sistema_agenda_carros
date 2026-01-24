import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TELEFONE_MAX_LENGTH, CPF_MAX_LENGTH } from "@/constants/clientes"
import type { FormDataCliente } from "./types"

interface ClienteFormProps {
  formData: FormDataCliente
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  errors?: Partial<Record<keyof FormDataCliente, string>>
}

export function ClienteForm({ formData, onChange, errors }: ClienteFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={onChange}
          placeholder="Ex: João Silva"
          required
          aria-invalid={!!errors?.nome}
          aria-describedby={errors?.nome ? "nome-error" : undefined}
        />
        {errors?.nome && (
          <p id="nome-error" className="text-sm text-destructive">
            {errors.nome}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">
          Telefone <span className="text-destructive">*</span>
        </Label>
        <Input
          id="telefone"
          name="telefone"
          type="tel"
          value={formData.telefone}
          onChange={onChange}
          placeholder="Ex: (11)999316632"
          maxLength={TELEFONE_MAX_LENGTH}
          required
          aria-invalid={!!errors?.telefone}
          aria-describedby={errors?.telefone ? "telefone-error" : undefined}
        />
        {errors?.telefone && (
          <p id="telefone-error" className="text-sm text-destructive">
            {errors.telefone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Ex: joao@email.com"
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "email-error" : undefined}
        />
        {errors?.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={onChange}
          placeholder="Ex: 000.000.000-00"
          maxLength={CPF_MAX_LENGTH}
          aria-invalid={!!errors?.cpf}
          aria-describedby={errors?.cpf ? "cpf-error" : undefined}
        />
        {errors?.cpf && (
          <p id="cpf-error" className="text-sm text-destructive">
            {errors.cpf}
          </p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={onChange}
          placeholder="Ex: Rua Exemplo, 123 - Bairro - Cidade/UF"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="observacoes">Observações</Label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={onChange}
          placeholder="Anotações sobre o cliente, preferências, etc."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          rows={4}
        />
      </div>
    </div>
  )
}
