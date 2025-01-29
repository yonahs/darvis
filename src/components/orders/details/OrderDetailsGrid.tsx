import { ReactNode } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface OrderDetailsGridProps {
  children: ReactNode
  layouts: any
  onLayoutChange: (layout: any, allLayouts: any) => void
}

export const OrderDetailsGrid = ({ children, layouts, onLayoutChange }: OrderDetailsGridProps) => {
  return (
    <div className="p-0">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }}
        rowHeight={120}
        margin={[4, 4]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        compactType="vertical"
        verticalCompact={true}
        preventCollision={false}
        useCSSTransforms
        onLayoutChange={onLayoutChange}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  )
}