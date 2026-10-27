'use client'
import { type FC, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { useTranslations } from '@fuma-translate/react'
import { useResponseExamples } from 'fumadocs-openapi/operation'
import type { PlaygroundResponse } from 'fumadocs-openapi/playground'
import { ExampleSelect } from '../../../api/ui/example'
import {
  PanelHeader,
  panelCodeBlock,
  panelTopCodeBlock,
  Placeholder,
  SendingOverlay,
} from '../../../api/ui/playground/panels'
import { Segmented, SegmentedList, SegmentedPanel } from '../../../api/ui/segmented'
import { ClientCodeBlock } from '../../components/codeblock'
import { CodeUsages } from '../../operation/usage-tabs'
import { Markdown } from '../../components/markdown'
import { cn } from '../../../../lib/cn'
import { DefaultResultDisplay, type ResultDisplayProps } from './result-display'

export function ResponsePanel({
  response,
  loading,
  onReset,
  ResultDisplay = DefaultResultDisplay,
  className,
}: {
  response?: PlaygroundResponse
  loading: boolean
  onReset: () => void
  ResultDisplay?: FC<ResultDisplayProps>
  className?: string
}) {
  const t = useTranslations({ note: 'playground' })

  return (
    <div className={cn('@container flex min-h-0 flex-col', className)}>
      <CodeUsages
        title={t('Request')}
        className={panelTopCodeBlock.className}
        viewportClassName="max-h-[min(18rem,30vh)]"
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        {response ? (
          <ResultDisplay
            key={response.id}
            data={response.result}
            reset={onReset}
            className="motion-safe:transition-[opacity,translate] motion-safe:duration-300 starting:opacity-0 motion-safe:starting:translate-y-1"
          />
        ) : (
          <ResponseExamples />
        )}
        {loading && <SendingOverlay />}
      </div>
    </div>
  )
}

function ResponseExamples() {
  const t = useTranslations({ note: 'playground' })
  const tabs = useResponseExamples()
  const [code, setCode] = useState<string>()
  const [selected, setSelected] = useState(0)

  if (tabs.length === 0)
    return (
      <Placeholder icon={SendHorizontal}>
        {t('Send a request to see its response.')}
      </Placeholder>
    )

  const tab = tabs.find((item) => item.code === code) ?? tabs[0]
  const examples = tab.examples ?? []
  const example = examples[selected]

  return (
    <Segmented
      value={tab.code}
      onValueChange={(value: string) => {
        setCode(value)
        setSelected(0)
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <PanelHeader className="border-b-0">
        <span className="me-auto text-[0.8125rem] font-medium">{t('Response')}</span>
        {examples.length > 1 && (
          <ExampleSelect
            items={examples.map((item, i) => ({ value: String(i), label: item.label }))}
            value={String(selected)}
            onValueChange={(v) => setSelected(Number(v))}
          />
        )}
        <SegmentedList
          className="max-w-1/2 shrink-0 [scrollbar-width:none] overflow-x-auto"
          items={tabs.map((item) => ({
            value: item.code,
            label: <span className="font-mono">{item.code}</span>,
          }))}
        />
      </PanelHeader>
      {tab.response.description && (
        <div className="prose prose-xs prose-no-margin text-fd-muted-foreground -mt-1 px-4 pb-2.5">
          <Markdown md={tab.response.description} />
        </div>
      )}
      <SegmentedPanel
        key={tab.code}
        value={tab.code}
        className="flex min-h-0 flex-1 flex-col overflow-auto border-t"
      >
        {example ? (
          <div className="min-h-0 flex-1">
            <ClientCodeBlock
              lang="json"
              code={JSON.stringify(example.sample, null, 2)}
              codeblock={panelCodeBlock}
            />
          </div>
        ) : (
          <p className="text-fd-muted-foreground p-4 text-sm">
            {t('No example available.')}
          </p>
        )}
      </SegmentedPanel>
    </Segmented>
  )
}
