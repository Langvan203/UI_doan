import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/app/providers/language-provider"
import { AuthProvider } from "@/components/context/AuthContext"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer } from "react-toastify"
import { DepartmentProvider } from "@/components/context/DepartmentContext"
import { BuildingProvider } from "@/components/context/BuildingContext"
import { EmployeeProvider } from "@/components/context/EmployeeContext"
import { RoleProvider } from "@/components/context/RoleContext"
import { ServiceTypeProvider } from "@/components/context/ServiceTypeContext"
import { ServicesProvider } from "@/components/context/ServicesContext"
import { ServicesUsageProvider } from "@/components/context/ServiceUsage"
import { ElectricityRateProvider } from "@/components/context/ElectricityRate"
import { WaterRateProvider } from "@/components/context/WaterRate"
import { MetterProvider } from "@/components/context/MetterContext"
import { ResidentProvider } from "@/components/context/ResidentContext"
import { ApartmentProvider } from "@/components/context/ApartmentContext"
import { BuildingSystemProvider } from "@/components/context/BuildingSystemContext"
import { StaffProvider } from "@/components/context/StaffContext"
import { StatusMaintanceProvider } from "@/components/context/StatusMaintance"
import { MaintancePlanProvider } from "@/components/context/MaintancePlan"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Building Management System",
  description: "A comprehensive building management system",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <AuthProvider>
              <BuildingProvider>
                <ServiceTypeProvider>
                  <ServicesProvider>
                    <DepartmentProvider>
                      <EmployeeProvider>
                        <RoleProvider>
                          <ServicesUsageProvider>
                            <ElectricityRateProvider>
                              <WaterRateProvider>
                                <MetterProvider>
                                  <ResidentProvider>
                                    <ApartmentProvider>
                                      <BuildingSystemProvider>
                                        <StaffProvider>
                                          <StatusMaintanceProvider>
                                            <MaintancePlanProvider>
                                              {children}
                                            </MaintancePlanProvider>
                                          </StatusMaintanceProvider>
                                        </StaffProvider>
                                      </BuildingSystemProvider>
                                    </ApartmentProvider>
                                  </ResidentProvider>
                                </MetterProvider>
                              </WaterRateProvider>
                            </ElectricityRateProvider>
                          </ServicesUsageProvider>
                          <ToastContainer />
                        </RoleProvider>
                      </EmployeeProvider>
                    </DepartmentProvider>
                  </ServicesProvider>
                </ServiceTypeProvider>
              </BuildingProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
