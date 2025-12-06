# Phase 2 - Dashboard Component Building

## Overview
Phase 2 builds the interactive dashboard UI components that replicate the reference MVP functionality.

## Parallel Agent Strategy
Deploy 4 component-builder agents simultaneously to maximize speed. Each agent works on isolated components with clear boundaries.

---

## Agent Assignments

### Agent 1 - Tabs & Table Foundation
**Model:** haiku (fast, cost-effective for straightforward components)
**Task File:** `.claude/tasks/phase2-agent1-tabs-table-foundation.md`

**Components:**
1. `gift-list-tabs.tsx` - Tab navigation between gift lists
2. `gift-item-row.tsx` - Individual table row with selection
3. `status-badge.tsx` - Required/Optional badge
4. `price-item.tsx` - Single retailer price display

**Dependencies:** None (foundational components)
**Estimated Time:** 15-20 minutes

---

### Agent 2 - Table Container & Grid
**Model:** haiku
**Task File:** `.claude/tasks/phase2-agent2-table-container.md`

**Components:**
1. `gift-items-table.tsx` - Main table container
2. `price-grid.tsx` - Grid of retailer prices per item

**Dependencies:** Requires Agent 1's components (gift-item-row, price-item)
**Estimated Time:** 15-20 minutes
**Note:** Can start in parallel, but integration will reference Agent 1's exports

---

### Agent 3 - Action Buttons & Operations
**Model:** haiku
**Task File:** `.claude/tasks/phase2-agent3-actions.md`

**Components:**
1. `action-buttons.tsx` - Bulk action buttons
2. `lib/actions/mark-complete.ts` - Server actions for marking items complete

**Dependencies:** None (standalone functionality)
**Estimated Time:** 20-25 minutes

---

### Agent 4 - Filters & Totals
**Model:** haiku
**Task File:** `.claude/tasks/phase2-agent4-filters-totals.md`

**Components:**
1. `filter-bar.tsx` - Filter buttons
2. `totals-display.tsx` - Running cost totals
3. `lib/utils/totals.ts` - Totals calculation utility

**Dependencies:** None (standalone functionality)
**Estimated Time:** 15-20 minutes

---

## Coordination Strategy

### File Conflict Prevention
All agents registered in `AGENTS.md` with explicit file claims. No overlapping files.

### Shared Resources
All agents can read (but not modify):
- `types/database.ts`
- `types/dashboard.ts`
- `hooks/use-selection.ts`
- `hooks/use-privacy-blur.ts`
- `hooks/use-bulk-open.ts`
- `components/ui/*`
- `reference/*` (MVP files)

### Integration Approach
**Sequential Integration After Parallel Build:**
1. Agents build components in parallel
2. Project Manager reviews all outputs
3. Project Manager integrates into `app/(dashboard)/page.tsx`
4. Run TypeScript check
5. Test in browser

---

## Success Criteria

### For Each Agent
- [ ] All assigned files created
- [ ] TypeScript compiles without errors (npx tsc --noEmit)
- [ ] Props interfaces exported
- [ ] Dark theme colors match CLAUDE.md exactly
- [ ] Components use 'use client' where needed
- [ ] Imports use absolute paths (@/...)

### For Phase 2 Overall
- [ ] All 10 component files created
- [ ] Full TypeScript compilation passes
- [ ] Components integrate into dashboard page
- [ ] Dev server runs without errors
- [ ] UI matches MVP reference visually
- [ ] Click-to-select works
- [ ] Bulk actions work
- [ ] Filters and totals display correctly

---

## Risk Mitigation

### Potential Issues
1. **Agent 2 depends on Agent 1 components**
   - Mitigation: Both start in parallel. Agent 2 can stub imports initially.

2. **TypeScript errors from missing exports**
   - Mitigation: Each agent exports props interfaces immediately

3. **Dark theme color inconsistencies**
   - Mitigation: Task files include exact color values

4. **Component integration complexity**
   - Mitigation: Project Manager handles final integration

### Conflict Resolution
If any agent encounters:
- File already exists (created by another agent)
- Import path errors
- Type definition conflicts

**Action:** STOP and report in claude-progress.txt

---

## Post-Build Integration

After all 4 agents complete, Project Manager will:

1. Verify all files exist
2. Run TypeScript check across all components
3. Create dashboard page that imports and uses all components
4. Wire up state management (useSelection, useBulkOpen)
5. Test in browser
6. Fix any integration issues
7. Update feature-status.json
8. Update claude-progress.txt

---

## Timeline

```
T+0:00   Spawn 4 agents in parallel
T+0:20   Most agents complete (haiku speed)
T+0:25   All agents complete
T+0:30   Project Manager reviews outputs
T+0:45   Integration into dashboard page complete
T+1:00   Testing and fixes complete
```

**Total Estimated Time:** 1 hour from spawn to working dashboard
