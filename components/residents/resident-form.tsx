"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schema validation
const formSchema = z.object({
  hoTen: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  cccd: z.string().min(9, {
    message: "CCCD/CMT phải có ít nhất 9 ký tự",
  }).optional().or(z.literal('')),
  ngayCap: z.date({
    required_error: "Vui lòng chọn ngày cấp",
  }).optional(),
  noiCap: z.string().optional(),
  gioiTinh: z.boolean().default(true),
  taiKhoanCuDan: z.string().min(3, {
    message: "Tài khoản phải có ít nhất 3 ký tự",
  }),
  matKhau: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  dienThoai: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  isCaNhan: z.boolean().default(true),
  maSoThue: z.string().optional(),
  diaChiThuongTru: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự",
  }),
  quocTich: z.string().default("Việt Nam"),
  ctyTen: z.string().optional(),
  soFax: z.string().optional(),
  maTN: z.number().optional(),
  maKN: z.number().optional(),
  maTL: z.number().optional(),
});

interface Building {
  id: number
  name: string
}

interface Block {
  id: number
  name: string
  buildingId: number
}

interface Floor {
  id: number
  number: number
  blockId: number
}

interface ResidentFormProps {
  buildings: Building[]
  blocks: Block[]
  floors: Floor[]
  onSubmit: (values: z.infer<typeof formSchema>) => void
  isLoading?: boolean
}

export function ResidentForm({
  buildings,
  blocks,
  floors,
  onSubmit,
  isLoading = false,
}: ResidentFormProps) {
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([])
  const [filteredFloors, setFilteredFloors] = useState<Floor[]>([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hoTen: "",
      cccd: "",
      noiCap: "",
      gioiTinh: true,
      taiKhoanCuDan: "",
      matKhau: "",
      dienThoai: "",
      email: "",
      isCaNhan: true,
      maSoThue: "",
      diaChiThuongTru: "",
      quocTich: "Việt Nam",
      ctyTen: "",
      soFax: "",
    },
  })

  function handleSubmit(values: any) {
    onSubmit(values)
  }

  // Handle building selection to filter blocks
  const handleBuildingChange = (buildingId: number) => {
    const relatedBlocks = blocks.filter(block => block.buildingId === buildingId)
    setFilteredBlocks(relatedBlocks)
    setFilteredFloors([])
    form.setValue("maKN", undefined)
    form.setValue("maTL", undefined)
  }

  // Handle block selection to filter floors
  const handleBlockChange = (blockId: number) => {
    const relatedFloors = floors.filter(floor => floor.blockId === blockId)
    setFilteredFloors(relatedFloors)
    form.setValue("maTL", undefined)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="isCaNhan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                  <FormLabel>Loại khách hàng:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <span className={!field.value ? "font-medium" : "text-muted-foreground"}>Tổ chức</span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className={field.value ? "font-medium" : "text-muted-foreground"}>Cá nhân</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 md:w-[400px]">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="additional">Thông tin bổ sung</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hoTen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{form.watch("isCaNhan") ? "Họ tên" : "Tên công ty"}</FormLabel>
                      <FormControl>
                        <Input placeholder={form.watch("isCaNhan") ? "Nguyễn Văn A" : "Công ty XYZ"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dienThoai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0912345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diaChiThuongTru"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Đường ABC, Phường XYZ, Quận/Huyện, Tỉnh/TP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quocTich"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quốc tịch</FormLabel>
                      <FormControl>
                        <Input placeholder="Việt Nam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("isCaNhan") ? (
                  <FormField
                    control={form.control}
                    name="gioiTinh"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Giới tính</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "true")}
                            defaultValue={field.value ? "true" : "false"}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">Nam</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">Nữ</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="maSoThue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã số thuế</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="taiKhoanCuDan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tài khoản</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matKhau"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("isCaNhan") && (
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-sm font-medium">Thông tin CCCD/CMT</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cccd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số CCCD/CMT</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789012" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ngayCap"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày cấp</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy", { locale: vi })
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noiCap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nơi cấp</FormLabel>
                          <FormControl>
                            <Input placeholder="Cục Cảnh sát ĐKQL Cư trú và DLQG về Dân cư" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {!form.watch("isCaNhan") && (
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="text-sm font-medium">Thông tin công ty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="soFax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số Fax</FormLabel>
                          <FormControl>
                            <Input placeholder="028 1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="border p-4 rounded-md space-y-4">
                <h3 className="text-sm font-medium">Thông tin tòa nhà</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maTN"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tòa nhà</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? buildings.find((building) => building.id === field.value)?.name
                                  : "Chọn tòa nhà"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Tìm tòa nhà..." />
                              <CommandEmpty>Không tìm thấy tòa nhà nào</CommandEmpty>
                              <CommandGroup>
                                {buildings.map((building) => (
                                  <CommandItem
                                    key={building.id}
                                    value={building.name}
                                    onSelect={() => {
                                      form.setValue("maTN", building.id)
                                      handleBuildingChange(building.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        building.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {building.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maKN"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Khối nhà</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!form.watch("maTN")}
                              >
                                {field.value
                                  ? filteredBlocks.find((block) => block.id === field.value)?.name
                                  : "Chọn khối nhà"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Tìm khối nhà..." />
                              <CommandEmpty>Không tìm thấy khối nhà nào</CommandEmpty>
                              <CommandGroup>
                                {filteredBlocks.map((block) => (
                                  <CommandItem
                                    key={block.id}
                                    value={block.name}
                                    onSelect={() => {
                                      form.setValue("maKN", block.id)
                                      handleBlockChange(block.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        block.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {block.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maTL"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tầng</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!form.watch("maKN")}
                              >
                                {field.value
                                  ? `Tầng ${filteredFloors.find((floor) => floor.id === field.value)?.number}`
                                  : "Chọn tầng"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Tìm tầng..." />
                              <CommandEmpty>Không tìm thấy tầng nào</CommandEmpty>
                              <CommandGroup>
                                {filteredFloors.map((floor) => (
                                  <CommandItem
                                    key={floor.id}
                                    value={`Tầng ${floor.number}`}
                                    onSelect={() => {
                                      form.setValue("maTL", floor.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        floor.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    Tầng {floor.number}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" type="button" onClick={() => onSubmit(form.getValues() as any)}>Hủy</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 