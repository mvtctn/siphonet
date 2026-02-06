'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Save, Image as ImageIcon, ChevronLeft, Calendar, Eye, Trash2, Plus, X,
    Undo2, Redo2, Type, Hash, Quote, Bold, Italic, Underline, Strikethrough,
    Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, Link as LinkIcon,
    Minus, Eraser
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { db } from '@/db'
import { MediaLibrary } from './MediaLibrary'
import Link from 'next/link'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface Category {
    id: string
    name: string
    type?: 'product' | 'post'
}

interface Product {
    id?: string
    name: string
    slug?: string
    price: number
    old_price?: number | null
    description?: string

    category_id?: string
    images: string[]
    featured?: boolean
    status?: 'draft' | 'published'
    stock: number
    sku?: string
    technical_specifications?: Array<{
        parameter: string
        value: string
        unit?: string
    }>
    seo_metadata?: {
        title?: string
        description?: string
        keywords?: string
    }
}

interface ProductEditorProps {
    initialData?: Product
    categories: Category[]
}

const defaultProduct: Product = {
    name: '',
    slug: '',
    price: 0,
    old_price: null,
    sku: '',
    status: 'draft',
    featured: false,
    category_id: '',
    description: '',

    images: [],
    stock: 0, // Default stock
    technical_specifications: [], // Default technical_specifications
    seo_metadata: {}
}

export function ProductEditor({ initialData, categories }: ProductEditorProps) {
    const router = useRouter()
    const [product, setProduct] = useState<Product>(initialData || defaultProduct)
    const [isSaving, setIsSaving] = useState(false)
    const [isShowLibraryModal, setIsShowLibraryModal] = useState(false)
    const [selectedTab, setSelectedTab] = useState<'info' | 'specs' | 'seo'>('info')
    const [newCatName, setNewCatName] = useState('')
    const [localCategories, setLocalCategories] = useState(categories)
    const [activeDataTab, setActiveDataTab] = useState<'general' | 'inventory' | 'shipping' | 'attributes' | 'advanced'>('general')

    const [editorMode, setEditorMode] = useState<'html' | 'visual'>('visual')
    const visualRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const savedRange = useRef<Range | null>(null)

    // Quick add category
    const handleAddCategory = async () => {
        if (!newCatName) return
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName, type: 'product' })
            })
            const data = await res.json()
            if (data.success) {
                setLocalCategories([data.data, ...localCategories])
                setProduct({ ...product, category_id: data.data.id })
                setNewCatName('')
            }
        } catch (e) { alert('Lỗi tạo danh mục') }
    }

    const handleSubmit = async () => {
        setIsSaving(true)

        // Sync visual content before saving
        const finalDescription = editorMode === 'visual' && visualRef.current
            ? visualRef.current.innerHTML
            : product.description

        const isNew = !product.id || product.id === 'new'

        const productToSave = {
            ...product,
            description: finalDescription,
            // Remove old_price if not in DB to avoid errors, or handle specifically
            // old_price: undefined 
        }

        try {
            // Use base products API for both, ID should be in body for PUT
            const res = await fetch('/api/admin/products', {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSave)
            })
            const data = await res.json()
            if (data.success) {
                router.push('/admin/products')
                router.refresh()
            } else {
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('Có lỗi xảy ra')
        } finally {
            setIsSaving(false)
        }
    }

    // Add new spec row
    const addSpec = () => {
        const currentSpecs = Array.isArray(product.technical_specifications) ? product.technical_specifications : []
        setProduct({
            ...product,
            technical_specifications: [...currentSpecs, { parameter: '', value: '', unit: '' }]
        })
    }

    // Remove spec row
    const removeSpec = (index: number) => {
        const currentSpecs = Array.isArray(product.technical_specifications) ? product.technical_specifications : []
        const newSpecs = [...currentSpecs]
        newSpecs.splice(index, 1)
        setProduct({ ...product, technical_specifications: newSpecs })
    }

    // Update spec row
    const updateSpec = (index: number, field: 'parameter' | 'value' | 'unit', newValue: string) => {
        const currentSpecs = Array.isArray(product.technical_specifications) ? product.technical_specifications : []
        const newSpecs = [...currentSpecs]
        newSpecs[index] = { ...newSpecs[index], [field]: newValue }
        setProduct({ ...product, technical_specifications: newSpecs })
    }

    const execCommand = (command: string, value: string = '') => {
        if (editorMode === 'visual') {
            if (visualRef.current) {
                visualRef.current.focus()
                restoreSelection()
                document.execCommand(command, false, value)
                // Sync state immediately
                setProduct(prev => ({ ...prev, description: visualRef.current!.innerHTML }))
            }
        } else {
            const tags: Record<string, [string, string]> = {
                'bold': ['**', '**'],
                'italic': ['*', '*'],
                'underline': ['<u>', '</u>'],
                'strikeThrough': ['~~', '~~'],
                'formatBlock:h2': ['## ', ''],
                'formatBlock:h3': ['### ', ''],
                'formatBlock:blockquote': ['> ', ''],
                'insertUnorderedList': ['- ', ''],
                'createLink': ['[', '](url)'],
                'insertHorizontalRule': ['\n---\n', ''],
            }
            const [open, close] = tags[command] || tags[`${command}:${value}`] || ['', '']
            insertTag(open, close)
        }
    }

    const insertTag = (open: string, close: string) => {
        if (!contentRef.current) return
        const start = contentRef.current.selectionStart
        const end = contentRef.current.selectionEnd
        const text = contentRef.current.value
        const selectedText = text.substring(start, end)
        const newText = text.substring(0, start) + open + selectedText + close + text.substring(end)

        setProduct({ ...product, description: newText })
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.focus()
                contentRef.current.setSelectionRange(start + open.length, end + open.length)
            }
        }, 0)
    }

    const saveSelection = () => {
        if (editorMode === 'visual') {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
                savedRange.current = selection.getRangeAt(0)
            }
        }
    }

    const restoreSelection = () => {
        if (editorMode === 'visual' && savedRange.current) {
            const selection = window.getSelection()
            if (selection) {
                selection.removeAllRanges()
                selection.addRange(savedRange.current)
            }
        }
    }

    const handleInsertMedia = (url: string) => {
        const html = `<img src="${url}" alt="" class="max-w-full h-auto rounded-3xl shadow-xl my-10 mx-auto block" />\n`

        if (editorMode === 'visual') {
            if (visualRef.current) {
                visualRef.current.focus()

                let range: Range | null = null
                const selection = window.getSelection()

                if (savedRange.current) {
                    range = savedRange.current
                } else if (selection && selection.rangeCount > 0) {
                    range = selection.getRangeAt(0)
                }

                if (range) {
                    try {
                        range.deleteContents()
                        const el = document.createElement('div')
                        el.innerHTML = html
                        const frag = document.createDocumentFragment()
                        let node, lastNode
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node)
                        }
                        range.insertNode(frag)

                        if (lastNode) {
                            const newRange = document.createRange()
                            newRange.setStartAfter(lastNode)
                            newRange.collapse(true)
                            selection?.removeAllRanges()
                            selection?.addRange(newRange)
                            savedRange.current = newRange
                        }
                    } catch (e) {
                        console.error('Range insertion failed', e)
                        document.execCommand('insertHTML', false, html)
                    }
                } else {
                    document.execCommand('insertHTML', false, html)
                }

                // Sync state immediately
                setProduct(prev => ({ ...prev, description: visualRef.current!.innerHTML }))
            }
        } else {
            if (contentRef.current) {
                contentRef.current.focus()
                const start = contentRef.current.selectionStart
                const end = contentRef.current.selectionEnd
                const text = contentRef.current.value
                const newText = text.substring(0, start) + html + text.substring(end)
                setProduct({ ...product, description: newText })
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.setSelectionRange(start + html.length, start + html.length)
                    }
                }, 0)
            }
        }
        setIsShowLibraryModal(false)
    }

    const toggleMode = (mode: 'html' | 'visual') => {
        if (mode === editorMode) return
        if (mode === 'html' && visualRef.current) {
            setProduct({ ...product, description: visualRef.current.innerHTML })
        }
        setEditorMode(mode)
    }

    const Toolbar = () => (
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1">
            {/* Group: History */}
            <div className="flex items-center gap-0.5 mr-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('undo'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Hoàn tác"><Undo2 className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('redo'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Làm lại"><Redo2 className="h-4 w-4" /></button>
            </div>
            <div className="w-px h-6 bg-slate-300 mx-1" />

            {/* Group: Blocks */}
            <div className="flex items-center gap-0.5 mr-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'h2'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Tiêu đề 2"><Hash className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'h3'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Tiêu đề 3"><Type className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'blockquote'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Trích dẫn"><Quote className="h-4 w-4" /></button>
            </div>
            <div className="w-px h-6 bg-slate-300 mx-1" />

            {/* Group: Inline Styling */}
            <div className="flex items-center gap-0.5 mr-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In đậm"><Bold className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="In nghiêng"><Italic className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Gạch chân"><Underline className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('strikeThrough'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Gạch ngang"><Strikethrough className="h-4 w-4" /></button>
            </div>
            <div className="w-px h-6 bg-slate-300 mx-1" />

            {/* Group: Alignment */}
            <div className="flex items-center gap-0.5 mr-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Căn trái"><AlignLeft className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Căn giữa"><AlignCenter className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('justifyRight'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Căn phải"><AlignRight className="h-4 w-4" /></button>
            </div>
            <div className="w-px h-6 bg-slate-300 mx-1" />

            {/* Group: Lists & Media */}
            <div className="flex items-center gap-0.5 mr-2">
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Danh sách"><List className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('createLink'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Liên kết"><LinkIcon className="h-4 w-4" /></button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('insertHorizontalRule'); }} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-all hover:text-primary active:scale-90" title="Đường kẻ ngang"><Minus className="h-4 w-4" /></button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                        setIsShowLibraryModal(true);
                    }}
                    className="p-2 hover:bg-white rounded-lg text-emerald-600 transition-all hover:text-emerald-700 active:scale-90"
                    title="Thư viện ảnh"
                >
                    <ImageIcon className="h-4 w-4" />
                </button>
            </div>
            <div className="w-px h-6 bg-slate-300 mx-1" />

            <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('removeFormat'); }} className="p-2 hover:bg-white rounded-lg text-red-500 transition-all hover:text-red-700 active:scale-90" title="Xóa định dạng"><Eraser className="h-4 w-4" /></button>

            <div className="ml-auto flex items-center gap-3 bg-white/50 p-1 rounded-xl border border-slate-200 shadow-sm text-[10px] font-bold">
                <button
                    type="button"
                    onClick={() => toggleMode('html')}
                    className={`px-3 py-1 rounded-lg transition-all ${editorMode === 'html' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    CODE
                </button>
                <button
                    type="button"
                    onClick={() => toggleMode('visual')}
                    className={`px-3 py-1 rounded-lg transition-all ${editorMode === 'visual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    VISUAL
                </button>
            </div>
        </div>
    )

    return (
        <div className="max-w-[1600px] mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {product.id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* --- MAIN COLUMN (Left) --- */}
                <div className="col-span-12 lg:col-span-9 space-y-6">

                    {/* Title Input */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <input
                            type="text"
                            placeholder="Tên sản phẩm"
                            className="w-full px-4 py-3 text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-300"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        />
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <span>Permalink:</span>
                            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                                {`https://siphonet.vn/san-pham/${product.slug || '...'}`}
                            </span>
                            <button className="text-xs px-2 py-0.5 border rounded hover:bg-slate-50">Sửa</button>
                        </div>
                    </div>

                    {/* Main Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-4 border-b border-slate-100 font-semibold bg-slate-50/50">Mô tả chi tiết</div>
                        <div className="p-4">
                            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm min-h-[500px] flex flex-col">
                                <Toolbar />
                                {editorMode === 'html' ? (
                                    <textarea
                                        ref={contentRef}
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                        className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:ring-0 border-none resize-none placeholder:text-slate-200 min-h-[400px]"
                                        placeholder="Nhập mô tả sản phẩm ở đây..."
                                    />
                                ) : (
                                    <div
                                        ref={visualRef}
                                        contentEditable
                                        dangerouslySetInnerHTML={{ __html: product.description || '' }}
                                        className="w-full flex-1 p-8 text-lg text-slate-700 font-serif leading-relaxed focus:outline-none min-h-[400px] prose max-w-none"
                                        onBlur={(e) => setProduct({ ...product, description: e.currentTarget.innerHTML })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Data Panel (Tabs Style) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-200 bg-slate-50">
                            <div className="px-4 py-3 font-semibold text-slate-700 bg-white border-r border-slate-200">Dữ liệu sản phẩm</div>
                            <div className="px-4 py-3 text-slate-500 border-r border-slate-200 text-sm flex items-center">Sản phẩm đơn giản</div>
                        </div>
                        <div className="grid grid-cols-12 min-h-[300px]">
                            {/* Vertical Tabs */}
                            <div className="col-span-3 bg-slate-50 border-r border-slate-200 py-2 select-none">
                                <div
                                    onClick={() => setActiveDataTab('general')}
                                    className={`px-4 py-3 border-l-4 text-sm cursor-pointer transition-colors ${activeDataTab === 'general' ? 'border-primary bg-white text-primary font-medium' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                                >
                                    Chung
                                </div>
                                <div
                                    onClick={() => setActiveDataTab('inventory')}
                                    className={`px-4 py-3 border-l-4 text-sm cursor-pointer transition-colors ${activeDataTab === 'inventory' ? 'border-primary bg-white text-primary font-medium' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                                >
                                    Kiểm kê kho hàng
                                </div>
                                <div
                                    onClick={() => setActiveDataTab('attributes')}
                                    className={`px-4 py-3 border-l-4 text-sm cursor-pointer transition-colors ${activeDataTab === 'attributes' ? 'border-primary bg-white text-primary font-medium' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                                >
                                    Thông số kỹ thuật
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="col-span-9 p-6 bg-white">
                                {activeDataTab === 'general' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <label className="col-span-3 text-sm font-medium text-slate-700">Giá bán thường (₫)</label>
                                            <input
                                                type="number"
                                                className="col-span-4 px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                value={product.price}
                                                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <label className="col-span-3 text-sm font-medium text-slate-700">Giá khuyến mãi (₫)</label>
                                            <input
                                                type="number"
                                                className="col-span-4 px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                value={product.old_price || ''}
                                                onChange={(e) => setProduct({ ...product, old_price: e.target.value ? Number(e.target.value) : null })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeDataTab === 'inventory' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <label className="col-span-3 text-sm font-medium text-slate-700">Mã sản phẩm (SKU)</label>
                                            <input
                                                type="text"
                                                className="col-span-4 px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                value={product.sku}
                                                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <label className="col-span-3 text-sm font-medium text-slate-700">Tình trạng kho hàng</label>
                                            <select
                                                className="col-span-4 px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                                                value={product.stock > 0 ? 'instock' : 'outofstock'}
                                                onChange={(e) => setProduct({ ...product, stock: e.target.value === 'instock' ? 100 : 0 })}
                                            >
                                                <option value="instock">Còn hàng</option>
                                                <option value="outofstock">Hết hàng</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {activeDataTab === 'attributes' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold text-slate-800 text-sm">Thông số kỹ thuật sản phẩm</h3>
                                            <button
                                                onClick={addSpec}
                                                className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded border border-slate-200 transition-colors"
                                            >
                                                <Plus size={14} /> Thêm thông số
                                            </button>
                                        </div>

                                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                            {(!product.technical_specifications || (Array.isArray(product.technical_specifications) && product.technical_specifications.length === 0)) && (
                                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-lg text-slate-400 text-sm">
                                                    Chưa có thông số kỹ thuật nào. Nhấn "Thêm thông số" để bắt đầu.
                                                </div>
                                            )}

                                            {Array.isArray(product.technical_specifications) && product.technical_specifications.map((spec: any, idx: number) => (
                                                <div key={idx} className="flex gap-2 items-center group">
                                                    <input
                                                        placeholder="Tên thông số (VD: Lưu lượng)"
                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                                        value={spec.parameter}
                                                        onChange={(e) => updateSpec(idx, 'parameter', e.target.value)}
                                                    />
                                                    <input
                                                        placeholder="Giá trị (VD: 100)"
                                                        className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                                        value={spec.value}
                                                        onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                                                    />
                                                    <input
                                                        placeholder="Đơn vị (VD: m3/h)"
                                                        className="w-24 px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                                                        value={spec.unit}
                                                        onChange={(e) => updateSpec(idx, 'unit', e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => removeSpec(idx)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Xóa dòng này"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>

                {/* --- SIDEBAR COLUMN (Right) --- */}
                <div className="col-span-12 lg:col-span-3 space-y-6">

                    {/* Publish Box */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Đăng bài viết</div>
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Trạng thái:</span>
                                <select
                                    value={product.status}
                                    onChange={(e) => setProduct({ ...product, status: e.target.value as any })}
                                    className="border-none bg-transparent font-bold focus:ring-0 cursor-pointer text-slate-800"
                                >
                                    <option value="draft">Bản nháp</option>
                                    <option value="published">Đã đăng</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-2">
                                <span className="flex items-center gap-2"><Eye size={14} /> Chế độ xem:</span>
                                <span className="font-bold">Công khai</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 border-t border-slate-100 pt-2">
                                <span className="flex items-center gap-2"><Calendar size={14} /> Đăng ngay:</span>
                                <span className="font-bold text-blue-600 cursor-pointer">Chỉnh sửa</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center">
                            <button className="text-red-500 hover:text-red-700 text-sm underline">Bỏ vào thùng rác</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="bg-primary text-white px-4 py-2 rounded shadow-sm hover:bg-primary-600 font-medium transition-transform active:scale-95"
                            >
                                {isSaving ? 'Đang lưu...' : (product.id ? 'Cập nhật' : 'Đăng bài viết')}
                            </button>
                        </div>
                    </div>

                    {/* Categories Box */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Danh mục sản phẩm</div>
                        <div className="p-4">
                            <div className="max-h-[200px] overflow-y-auto space-y-2 border border-slate-200 rounded p-2 bg-slate-50 mb-3">
                                {localCategories.filter(c => !c.type || c.type === 'product').map(cat => (
                                    <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 p-1 rounded cursor-pointer">
                                        <input
                                            type="radio" // Using radio for now based on DB 1-1 constraint
                                            name="category"
                                            checked={product.category_id === cat.id}
                                            onChange={() => setProduct({ ...product, category_id: cat.id })}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="+ Thêm danh mục mới"
                                    className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-300"
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Ảnh sản phẩm</div>
                        <div className="p-4">
                            {product.images && product.images.length > 0 ? (
                                <div className="relative group">
                                    <img
                                        src={product.images[0]}
                                        alt="Product"
                                        className="w-full h-auto rounded border border-slate-200"
                                    />
                                    <button
                                        onClick={() => setProduct({ ...product, images: [] })}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Xóa ảnh"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-400">
                                    <ImageIcon className="mx-auto mb-2 opacity-50" />
                                    Chưa có ảnh
                                </div>
                            )}
                            <div className="mt-3">
                                <p className="text-blue-600 underline text-sm cursor-pointer hover:text-blue-800" onClick={() => (document.querySelector('input[type=file]') as HTMLInputElement)?.click()}>
                                    Thiết lập ảnh sản phẩm
                                </p>
                                {/* Hidden Image Upload for Trigger */}
                                <div className="hidden">
                                    <ImageUpload
                                        value={product.images}
                                        onChange={(urls) => setProduct({ ...product, images: urls })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Thư viện ảnh sản phẩm</div>
                        <div className="p-4">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {product.images.slice(1).map((img, idx) => (
                                    <img key={idx} src={img} className="w-full h-16 object-cover rounded border border-slate-200" />
                                ))}
                            </div>
                            <p className="text-blue-600 underline text-sm cursor-pointer hover:text-blue-800">Thêm ảnh thư viện sản phẩm</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Từ khóa sản phẩm</div>
                        <div className="p-4">
                            <div className="flex gap-2 mb-2">
                                <input type="text" className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm" />
                                <button className="px-3 py-1 border border-slate-300 bg-slate-50 rounded text-sm">Thêm</button>
                            </div>
                            <p className="text-xs text-slate-500 italic">Phân cách các thẻ bằng dấu phẩy (,).</p>
                            <div className="mt-2 text-xs text-blue-600 underline cursor-pointer">Chọn từ những từ khóa được sử dụng nhiều</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Library Modal */}
            {isShowLibraryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/20">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Thư viện Media</h2>
                                <p className="text-sm text-slate-500 font-medium">Chọn một ảnh để chèn vào mô tả sản phẩm.</p>
                            </div>
                            <button
                                onClick={() => setIsShowLibraryModal(false)}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-8">
                            <MediaLibrary onSelect={handleInsertMedia} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
