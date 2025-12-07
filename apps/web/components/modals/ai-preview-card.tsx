import type { QuickAddData } from '@/types/ai'

interface AIPreviewCardProps {
  data: QuickAddData
  itemName: string
  onRetry: () => void
}

export function AIPreviewCard({ data, itemName, onRetry }: AIPreviewCardProps) {
  const retailerCount = data.retailers.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#e4e4e7]">AI Found This:</h3>
        <button
          onClick={onRetry}
          className="text-xs text-[#6366f1] hover:text-[#5558e3] transition-colors"
        >
          Try Different Search
        </button>
      </div>

      {/* Item Details Card */}
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs text-[#a1a1aa] mb-1">Item Name</p>
            <p className="text-sm text-[#e4e4e7] font-medium">{itemName}</p>
          </div>
          <a
            href={data.imageSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Images
          </a>
        </div>

        <div>
          <p className="text-xs text-[#a1a1aa] mb-1">Description</p>
          <p className="text-sm text-[#e4e4e7]">{data.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#a1a1aa] mb-1">Price Range</p>
            <p className="text-lg font-bold text-[#6366f1]">
              ${data.priceRange.low} - ${data.priceRange.high}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#a1a1aa] mb-1">Suggested Status</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              data.suggestedStatus === 'required'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {data.suggestedStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Retailers Found */}
      <div>
        <p className="text-xs text-[#a1a1aa] mb-2">
          {retailerCount} {retailerCount === 1 ? 'Retailer' : 'Retailers'} Found
        </p>
        <div className="space-y-2">
          {data.retailers.map((retailer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#0f0f0f] border border-[#2d2d2d] rounded px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#e4e4e7]">{retailer.storeName}</span>
                {retailer.isBestPrice && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Best Price
                  </span>
                )}
                {retailer.isHighend && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    Premium
                  </span>
                )}
              </div>
              <span className="text-sm text-[#a1a1aa]">${retailer.estimatedPrice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Hint */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded p-3">
        <p className="text-xs text-indigo-400">
          This data looks good? Click &quot;Add to List&quot; below to save it.
          Want to adjust details? Click &quot;Edit Manually&quot; to make changes.
        </p>
      </div>
    </div>
  )
}
