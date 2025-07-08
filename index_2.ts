// RUTA: supabase/functions/send-confirmation-email/index.ts
// REEMPLAZA TODO EL CONTENIDO DE TU ARCHIVO CON ESTE CÓDIGO.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@^1.17.1';

// ================== 1. DATOS BASE Y CONSTANTES ==================
const logoUrlParaEmail = 'https://i.imgur.com/3Yzqg4n.png'; // URL pública para el correo
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");

// Pega aquí tus códigos Base64 COMPLETOS y OPTIMIZADOS
const vecyLogoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAC5ALkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKxfE3jLRvB9mbnVr+K0j7Bj8zewHU14V4w/auyzweG9PyOgurv+YUf1rwsyzvL8pjfF1Un23f3LU97LcjzDNX/ALNTbj3ei+//ACPo5mCjJIA96w9U8c+H9Fz9t1iztyOqtMM/lXxd4g+J/ijxRIxv9YuGRv8AllG+xPyFc6WZjudizerHNfmuM8R6UW1hKDfnJ2/BX/M/QsL4fysniq/yiv1f+R9l3nx/8E2bEf2qZz/0xiZqzm/aY8FK2PNvj7i2OP518i0V81U8RM1k/chBfJv9T3YcCZZFe9Kb+a/yPsa1/aH8E3TAHUZIM/8APWBhXS6X8SvC+skC01yykY/wmUKfyNfClFddDxHx0X++oxkvK6/zOetwFgJL91VlF+dn+iP0NjmSZQ0bq6noynIp9fA2jeNde8NyB9N1a6tcfwrISv5HivVvCP7VOq6eyQ6/ZR6hB0M8HySD3x0P6V9pl/H2W4pqOJi6T89V96/yPlMbwLj6CcsNJVF22f3PT8T6jork/BfxQ8O+PIQdLv0afGWtpfklX/gJ6/hXWV+jUa9LEQVWjJSi+qd0fntfD1sLUdKvBxkujVgooorc5wooooAKKKKACiiigAooqvfX1vplnLdXUqwW8Sl3kc4Cgd6TaSuxxTk0luSySJDGzyMERRksxwAK8D+K37TdrorTaZ4X2Xl4Mq963McZ/wBn+8f0rzj42ftBXfjSebSNEka10VTtaRTh7jH8l9q8aSvxriPjRxcsLlj9Z/8AyP8An93c/buHeCIxjHF5qrvdQ/8Akv8AL7+xsa14h1LxNqD3uqXkt5ctyXkbOPYDtVaMVBHVmOvxOtUnWm51G231e5+t8kacVCCsl0RPGtPpq/dp1cjMAowcZxxXY/Db4Z6l8RtWENsphsoyPPumHyoPQep9q+m774J+GLzwePDscCxNEN6XK485Xx98nvn06V9nk/CmPzmhPEUrRitr/afZf57HyObcTYLKa0aFT3pPe32V3f8AkfGdFdD448Dan4B1qTT9Ri46xTqPklX1B/pXPV8lXoVcNUlRrR5ZR0afQ+oo1qeIpxq0pXi9U0IwyKryCrNQPWcTojuRQXc9hcJcW0zwTRncskbFWB9jXvHwv/agudPki07xZm6tuFXUEHzp/vgdR79a8Dkqu1fRZTnOMyip7TCzsuq6P1X9M4swynB5vS9lioX7PqvR/wBI/R3S9UtNasYb2xuI7q1mXcksZyCKt18I/Cr4yar8MdSUIzXekSN+/smPH+8vof519q+E/Fmm+NNFg1TSrhbi2lHb7yHurDsRX9HZDxDhs8pXh7tRbx/Vd0fzvxBw3iciqXfvUntL9H2f59DZooor6s+PCiiigAooooAbJIsUbO7BUUZLHoBXxx+0N8cH8Z6lJoOjzMmi27lZZFOPtDD/ANlFej/tSfF1vDeljwxpc23UbxM3MiHmOI9vqf5V8ixmvx7jTiCUL5ZhZf43/wC2/wCf3H7pwLw1HlWbYuOr+BP/ANK/y+/sWI+1WY+1VYzViM1+JyP2WRajNWY6qRmrEbVzSOOSLadK9A+Ffwl1D4jagHw1tpMTfvrojr/sr6mrfwd+Dd78QLxLy7V7XRI2+eXGDLj+Ff8AGvoTxv440P4NeGIrW1hjWfZttbGPjJ/vN7e9ff5Bw3CtSeaZs+TDx110cv8Agfi9kfnGecQTpVf7Nyxc9eWmn2f+D+XUj8VeKvD/AMD/AAnFaWkKCbbtt7RD80jf3mP8zXzZY/F7xDZ+NG8Rm7aW4dsSQsT5bR5+5j0rnfE3ibUPFurzajqU7T3Eh7nhR2UDsBWXXDnXFGIx+Ih9TfsqVN+4lpts3br5bI68o4coYGhP61+8q1Pjb136L/PqfZMM3hv4/eCSGUB8YK8edayY6j/OCK+XfiB8PtT+HmtNZX6bom5guVHySr6j39RUHgnxtqXgPW4tR06Ugg4lhJ+SVe6sK+r7G88N/HjwWyuiurDEkZx5ttJjqP8AHvX1UfqvG+G5ZWp42C36TS/r5eh83L6zwfiOaN54Ob+cH/X3+p8X1C9dl8Sfhvqfw51Zra7Qy2khJt7tR8si/wBD7VxUjV+U4jC1sHWlQxEeWUd0z9RwuIpYqlGvQlzRezRDIetVnqeQ1Xc1MT04ogeu5+D/AMWr74XeIFlVmm0mdgt1a54I/vD/AGhXCuarvXq4LF1sDXjiKErSiGIwdHHUJYbER5oS0aP0s0XWbTxBpdtqNhMtxaXCCSORTwQavV8gfst/F1vD+sDwtqc5/s69b/RWc8RSn+H2Dfzr6/r+oclzWnnGEjiYaPZrs/62P5S4gyWrkeNlhp6xesX3X+a2YUUUV7p82FY/i7xJbeEPDeoaxeMFgtImkPuQOB+JrYr5l/bK8dG003TfC9vJh7g/abgA/wAI4Ufnz+FeRm2OWW4KpinvFaevT8T38hyyWcZjSwa2b1/wrV/gfNfirxPd+MPEd/q965ee6kLnJ+6Oyj2ArOjNVVNTqa/litUnWnKpUd23d/M/sONKFGCp01aKVkvJFuM1PG1VVap0auOSMZIto1e0/BL4F3PjeaPVdXje20RDlVPDXB9B/s+9W/gT+z/L4maDXfEMTQ6WCGhtWGGn9z6L/OvcPil8U9L+FGhpFGkcmoOmy1so8DAHQkdlFfpGQ8N0adH+1s492jHVJ9fXy7Ld+m/5NxBxHVqV/wCycn96tLRtdPJefd7L12d8RPiNo/wi8Ox29vHF9r2bLSxj46dz6AV8g+IvFF/4s1efUtSnae5lOST0UdgB2Aql4h8TX/izV59S1Kdri6mbJJ6D2A7CqKyV81xFxDWzuqoRXLRj8Mf1fn+XQ9nIeHaWT0uab5q0vil+i8vzLVLUAel8w+tfF8p9Tysmre8E+OtS8A61HqOmy4I4lhY/JKvdSK5oyUxnrehVq4apGtRlyyjqmjKrh4YinKlVjeL0aZ9u6Xqnhr46eC3R0WaKQYmgY/vbeTHX2Poe9fKvxU+FupfDXWDFOrT6bKT9nvAOGHofRvasrwP491P4f69FqWnSYxxLCx+SVe6mvsHQtc8OfHLwTIrxrPbzLsuLVz88D4/Qjsa/Y6csJxvhfZ1bU8ZBaPpJf5d1ut1oflVSGL4LxPtad54Sb1XWL/z7dHs9T4UdqgkavRPi98ItR+GOqHIa60iZj9nuwOP91vRv515uzV+WYnB18DWlh8RHllHdH6/gsVQx1GOIw8uaMtn/AF1I5DUEhqR2zUDtWcUetFCJO9vMksbFJEYMrKcEEcg19/fA34iL8R/ANleyODqFuPs92vfzFHX8Rg/jX59yNXt37Jfjg+HviA2jzSYtNWj2BSeBKvKn8RkV+hcHZk8DmCoSfuVNPn0f6fM+E43ydZllUq0F79L3l6faX3a/I+2KKKK/oY/loTpzX54fHnxU3iz4qa5db98MMxtovQKny/zzX334q1QaL4Z1W/JwLa2kl/JSa/MW5unvLuedzueV2ck9yTmvyvjzEuOHo4Zfabb+X/Dn7h4Y4JSrYjGNfClFfPV/kiRTUyNVVGqxCjzSKkal3Y4VVGST6V+KNH73JdSzHlmAAyT0xX0z8A/2d2u/s/iLxRb7YOJLawkHL+jOPT2rQ+AH7OI09bfxF4ptw11w9tYSDIj9Gcevt2r0r4yfGbTvhbpBijKXGtTLi3tQfu/7Teg/nX6jkfDtDA0f7VzjSMdVF/g2u/ZfefiXEPE1fMMR/Y+R+9KWjkvxSfbvL7iT4ufF7TPhXowjTZNqsqYtrNe3YM3oor4s8QeJb/xVq0+palcNc3czZZmPT2HoKqeIPEmoeKtXuNT1O4a5u523MzHp7D0AqkrV8dxDxBWzutb4aUfhj+r8/wAj6zh7hujkVDX3qsvil+i8vzLatUiyVUWSpFevjXE+pcS0JPel8yq2+l8yo5SOUsGT3pjSVDvpC9PlGoj2eug8B/EDU/h5r0Wp6bLjBxNAx+SZO6kf17VzDSfjUbNXVh6tTD1I1qMuWUdU0TVw9PEU5Ua0eaMtGmffPhvxJ4c+N3gyT92lzbTL5dzZy43wvjofQ+hr5O+NHwW1D4Y6iZ4g13oUzfubrGSn+w/offvXMeAfiHqvw516PU9Mlx2mgY/JMndWH9e1fbPhPxZ4c+NXg2RlSO6tpk8u7sZsFom9CP5Gv2WjVwnGmF9jXtDFQWj7/wCa7rpuj8erUcbwNi/rFC88JN6rt/k+z67M/Pp2qBmr1z45fAu++Gd899ZK934emb93NjLQE/wP/Q968fZq/LcXga+X15YfERtJf1deR+z5djsPmWHjicLLmi/6s+zQ1jVnQ9Ym0HW7HUYGKzWs6TKR6gg1SZqhZqypylTkpx3Wp6zpqpFwkrpn6iaFqkeuaLY6hCd0V1CkykejAGr9eXfs062dc+DmhOzbnt1a3b/gLED9MV6jX9YYSusTh6ddfaSf3o/iXMcL9RxtbDfySa+52PPP2gtQOl/BvxROpw32Xywf95lX+tfnSrV+gH7VBZfgT4k29c235faYs1+fitX45x3JvHUodoX+9v8AyP6G8Maa/smtPq6jX3Rj/mXrO3mvriKC3jaaeRgqRoMliegAr7L/AGf/ANnGHwlHBr/iSFZ9YYB4bVhlbb3Pq38q+efgz8UPD/wvuX1G78Oyaxq+cRTtMFWFf9kYPPvXr2oftuedYzpZeG2humQiOSS4DKrdiRjmuHh7+xsF/tmPqp1FtGzdvPazfbojp4sjxBmF8BllBqk/inzRV/Ja3S79X6b+0fFT4pf8IZbrp2j2j6x4mulP2awgUuVH99gOgH618QeOpPEEvia6m8Tx3MWrSnzJFulKsAemAe3pXf8A7PvxKuf+F2Q6hrVybibWA1tJNIejNyuPQZAH416P+2d4TMlloviOJOYmNpOwHY/MpP45/Ou/OKk+I8tqZlCbSpStydLaavz1v2Wx4eS0KfCubUspqU05Vo39p1b191dldW7t2fkfLqvUqtVRXq/o+nz6zqlpYWyl57mVYkX3JxX5QoOTUYrVn67UtCLlLZG1b+D9dutCk1qLSrqTSo/vXaxkoMd8+lZAevs34rala/CL4GjSYNvnSW62EKn+JmHzt+WTXy74P+EPi3xxCJ9K0iWS2PS4lIjQ/Qnr+FfU5tkEsDiKWEw16lRxTkkr2fyPiMn4gjmGGq43E8tKkpNRbdrpev8AX3HLb/el8yu88SfAHxx4XsXvLnSGnt0GXa1cSlR6kDmvOixUkHg181icFiMHLkxFNwfmrfmfS4XFYbHR58NUU15NP8ix5nvTS9P0+xu9WvI7SygkurmQ4SKJSzE/SvT9P/Zh8e6haic2EFtkZEc9wqt+XatcLl2Lxt/q1KU7dk2ZYvH4PAW+tVowv3aR5W0lRs9dL40+GviXwC4GtaXLaxMcLOuGjb/gQ4rD0fQdT8SXRttLsLi/nA3GO3jLkD14rKeFr0qvsZwan2s7/cddLEYerS9vTqJw7pq337FJnro/h78RtV+G3iCPVNMl/wBma3Y/JMndWH9e1c3e20+n3UttcxPbzxMVeORSrKR2IPSptF0PUfE2oJY6VZzX12wJEMK7mwO9a4aVejWjKhdTT0tvc1xFLD16Eo4izpta32sfoF4M8ZeH/jL4PaaJI7m3nTyruxmwWjYjlWH8jXyh8fPgDdfDa6fVdKSS68Oyt97q1sT/AAt7ehrjfCfi7xJ8FPGXnLDLZXkJC3NjcAqJE67WH8jXt19+2hp2o2ctrd+EWuLeZCkkT3KlWB6gjbX6nXzXLc+wXss1fssRDROz3+S27p/I/JsLkmb8N5h7bJo+2w09XHmW3ze66SW63PlZmqFmrW8UX2l3+tXNxo9nLp9hI25LWWQOY89QGxyPSsZmr8vlFRk4p3t17n7fRbnBSatfo90fav7FepG6+HepWpOfs18cD0DKD/SvoWvmL9hpmPh3xTn7v2qHH/fDV9O1/SnDk3UynDt9rfc2j+Q+Mqap5/ior+ZP74p/qecftE6edS+C/imFRuIthKB/uOrf0r851av1G8ZaSNc8J6xp5GftNpLEPqVIFflzcQta3EsLja8blCD6g4r4Hjuj++oVu6a+53/U/WvC2upYLE4frGSf3q3/ALaSK1SK1V1apFavypo/ami9Z3kljdQ3ELlJonDow6hgcg194300Px0/Z/lliAe6urLdt/u3EfJH/fS/rXwGrV9QfsZfEIW+oah4SupP3dwDdWoY/wAYGHUfUYP4GvtOFMVCGKnga38OunF+vT9V8z8x45y+pUwcMyw6/eYeSkvS6v8Ao/kz5uYNG7IwwynBHcGveP2SfA//AAkPjibW5491ppSZQkcGVuB+Qya439oLwK/gr4pahbQREWt+/wBqtQo6hzyo+jZFfSHh2CD9nv4AyXlwFTVJYvOZT1adx8q/hx+RoyPKfY5pUlitIYe8pfLb79/kc/EmcKvk9KOC1qYq0Yrylv8Adt6sxPFEMfxu+PcOgOfN0Dw6he5UHiSTjI/PA/A1pfGj49v8N76Lw14XsIZr6GNfMbYSkAI4UKOpxXK/sY3g1DV/F1zcSeZfS+VIzMeSCWJP516B8Svjz4R+Gfia40+50eS81YKskjwwoOo4yx68V9ph6yqZXPMXXVGdabvNq7STaUV8l+Z+eYrDOjnEMqjhniIYeCtBOybaTlJ+rf5GH8IPjl4w8SavFYeIvDVxJaTnauoW1q6LGT/fB4x7ivPP2qvhlB4V1+117TIRDZamxWWJBhVmHOQO24c/UGt68/bPuLqZYNH8LBpJGCxiaYkknoMKK4v4zfELxzrV1olt4x0ZdF09Z1uYoVjIEmCMkkk5IB6e9eHmWNwOKyqeGlXlXlFpqfI1yvzfZ67n0GU5bmGEzmnio4eOGhJNOHOnzJLpHutNj1v4f+HtH+AHwsPirWLdZdYuI1c5Hz5b7kS+nvXlWq/tceNbu+aWz+x2Nvn5YRCH49yetes/tXWc2qfCPT7yyBktYLiKaTZyPLKkBvpkj86+M99cnEWOxWT1aeXYCbp04xT005m922d3C2W4TPaNXNMxgqtWc2ve1UUtkl0Pr7wH+0d4c+IXh++0nx5HaWMnlkMXBMNwvt12sP8A9VcZ+y74q0zR/iprWj2hzp+pB1s5JB83yMSo/Fc/lXzny2cDNaPhfxFP4W8R6bq1scTWc6TL74PI/EZryKfEmJqYjC1sSk3SfxW95p6NP5Hv1OEcLTwuMoYRtKstI391SWqa+dj2b9r7woNF+IFvq0Ue2HVIAzEDjzE4P6ba6n9izwzuk17X5EztC2kTH/vpsfpXWftM6XB4++C9n4jsR5v2Xy71GXk+W4w38x+VTfDl0+En7NLarMPKuXtXvPm4Jkk4Qf8AoNfaU8up4fiOpjH/AA1F1b9NVb87s+CqZpUxPCdLAR/jSmqNuujv+VkfN/7RXipPFXxY1qeEqYbdhaoy9wgwT+ea8xZu1Ourp7q4kmkbdJIxdmPck5NQM1flGKryxeIqYie8m397P3fL8HHA4WlhYbQil9yBmqNmoZqjZqxSPTSPtn9ibTzb/DzVbsjAuL7APrtUD+tfRNeT/svaKdF+DGhhl2vch7k5/wBpjj9MV6xX9O5LR9hl1Cm+kV+Op/F3FGIWJzrF1Ftztfdp+gh5GDX5s/Hjwu3g/wCLHiCx2bInuGuIeOCj/MP5n8q/Sevk/wDbf8BGS30nxbbR58v/AEO6KjseUJ/HI/EV4PF2CeKy51IrWm7/AC2f+fyPrPDnMlgs4+rzdo1ly/Nar9V8z5LVqkVqrq1SBq/A2j+qmiwGrc8H+JLrwb4m0vWrXcs1pMsy9twB5H0IyK55Wrv9T0M6p8I9F162XcdOu5dOu8fwhj5kZP5sK6MPTm26lN2lBc33Nflv8jy8bOnGMaVZXjUfK/mn+e3zPuC40Pwj8WofDPie4MNw1pi6tm8wdxnY/rg9vUV83/tbfFKPxN4kg8OadOJLDTTumaM5V5j298Dj8TXz3Ff3EK7Y55Y1/uq5AphkLEknJPevqs04mlmGFlQhSUHO3O0/it8j4HJuCo5XjI4mpXdSNO6hFr4bv1f5LuekfA/4nH4XeObfUpQz6dMvkXca9TGe49wcGvrXxz8J/B3x+sbTWre/xceWFj1CxZSWXrtcd8fmK+Aw3vWpo3irWPDzFtM1O708nr9mmZM/ka48pzyGDw8sDjKXtaMne3VPyOzPOGamPxUMxwFd0a8Va+6a8/6fofa3gf8AZx8I/Cu9/t3UdQa+mtfnSa9KpFFj+LHr9a8H/aW+MVr8SdftrHSjv0nTSwSfH+tc8Fh7ccV5PrHjTXfEChdT1e+v1H8NxOzj8iayN4q8xz2lWwv1DL6CpUm7vq36/wBMxynhevh8asyzTEOtWStHSyj6L/hj6/8A2efjbo3iXwrH4L8VSQrcRx/Z4WuyPLuYugQk/wAQHHPXitDxH+xv4b1a+NzpOq3WlwOdxgAEqD/dJ5H618YeZtORwa6Gw+JHinS7cW9n4h1K3hAwI47pwB+Ga6cPxDhq2Ghhs1w/teTRSvZ27f0zjxXCeMw+Lni8kxXsfaO8otXjfuv+G9GfY8fhX4cfs6+Gbme+8m7upUKsboLJPccfdVewr4l1i8gvtWvbi2hFtbyzPJHCP4FJJC/gKg1LV73Vrgz313NdzHrJPIXb8zVZFeZwiKzueAqjJNeRm2aQzFQpUKKp04bJb692fQZFkNTKfaV8TXdWrUtzN7abWX9fI+0f2VfEVt48+FuoeFdTxcCxLQNGx+9BICR+R3D8qyv2x/Ekei+E9D8J2PyiZvNeJO0UYwo+mf5VJ+yH8NdU8I2eq+JNZifT47yJY4YZvlOwHcXIPQfWuJ8Va7H8TfiD468VofM0PQNKltreQ/dZ2UouPqWY1+hTrVv9X6OHqrlq1Fy+fJG7b9OVfifllHDYf/WrEYqi+ajSfPpt7SVkkul3J/h5HziWqNmppamFq/IEj+iFEczVZ0XTJtc1iy0+BS011MkKAerECqTNXuf7IPgRvFXxKXVZo91lpCecSRx5p4QfzP4V62WYOWOxlPDx+0/w6/geZm2OhleArY2f2It/Povm7H3B4a0ePw/4f07TYhtjtbdIQP8AdUCtOiiv6djFRSitkfw1UnKpNzk9XqFc/wCPfCFr488I6nod4MxXkJQN/db+Fh9Dg10FFKcI1IuE1dPQujWnh6katJ2lFpp9mj8p/E/h688JeIL/AEfUIzFd2crROpHXB6j2I5rOVq+x/wBsT4LtrFiPGukwlru1QJfxIOXjHR/qvf2+lfGgav5wzrK55Vi5UX8L1i+6/wCBsz+1uHM6pZ/l0MXD4tpLtJb/AOa8icNXtX7NWtadqGrat4H1wj+yfEkHkqScbJ15Rh6H098V4gGqe0vJrG5iuIJGinicOkinBVgcgivOwWJeDxEa1rpbruno181oejmeAWY4Sphr8rez7SWsX8mkzsPid8ONV+Fvii40jUo2KAlre5A+SePPDD+o7VygavtX4eeK/DH7UXgEaD4njjHiGzTD7SFlyBgTRn37ivCfip+zD4q+Hs01zZQPrujA5W4tUzIg/wBtByPqOK93McilGH13L/3lCWum8fJry7/efHZRxPCdV5Zm9qWKho76Rn5xe2vb7jyLd70u6oW3RsVYFWHBVhgijd718hyn3/KTbqN1Q7jS7zRyi5SXdRuqLcaTf70cocpLur6M/Z3+K/w7+H/hG6/t60C68k7OJvs3mvImBtCtjjHPpXzbur0H4c/AzxZ8S7mP+z9PktrAn5766UpEo9v734V7mT1sVh8Up4Onzz2Stf5/8E+b4gwuBxWBlTzGq6dO6baly7dPO/Y9O+In7RviH4yXieFPB1hNZWl43lHbzPMD6kfdX1q98ZtIsvgf8EdP8F28qyazrMonv5F6sF5P4ZwB9K9d8J/Dzwf+zL4Rutav51mvlj/e30wG+Rsf6uMdsntXxd8U/iRffE/xhea3eZRXOyCHORFGOiivss1lWwGHlUx9TmxVVWS6Qg9/v2/pn57kFLD5ti4UcqpcmBoS5m3vUqLa99Wlv/lojlC1MZqaWpu6vzU/bVEfGjzSJGil3YhVUdST2r9F/wBnT4Zj4a/DqzgnjC6negXN2cchiOF/AcV81fsk/BlvGXiIeJ9ThP8AZGmvmFXHE0w6fgtfc3TgV+x8G5S6MHj6q1lpH06v5n87eJXEEa045Ph5aR1n69I/Ld+duwtFFFfpx+DhRRRQBHPBHdQyQyoskUilWRhkEHqDXwP+0t8A5vhlrT6zpMTSeG7yQkbRn7K5/gPt6H8K+/Ko61otj4i0u507UbaO7srhCkkMgyGBrws4ymlm+H9lPSS2fZ/5dz7DhniOvw5jPbQ1py0lHuv810+4/J7dTt1e1fH/APZt1L4XXk2qaTHJfeGZGysgG57bP8L+3o1eIhq/n3G4Gvl9Z0MRGzX4+aP7Cy3MsLm2GjisHPmg/vXk10aNPRdcvvDup2+o6bdSWV7A2+OaJsMpr69+Ev7ZenalDDp3jWP7Bd4C/wBowrmGT3deqn6cfSvjENS7q6stzbF5TPmw8tHuns/67nl55w3l+f01DGQ95bSWkl8/0d0fpRrHwz+HXxasxevp+namJRkXtkwV/wDvpD/OvMte/Yf8NXjM+l6zf6dnokoWZR/I/rXx34f8Xa14VuBPo+qXWnS/3reUpn6gda9T0H9rz4iaKqpNf2+qIP8An8gBb81wa+y/t7JsfrmGEtLuv81Z/mfmb4R4lynTKMfzQW0ZNr8HzR/I9Avf2FdWVj9k8T2ki9vOt2U/oTWef2HPFO7jXdLI9cSf4VLY/t2a9GoF34c0+Y9zHK6f41oD9vC628+E4c/9fZ/+Jp8vCU9btf8Agf8AwSf+Ng0/dtGX/gv/AIBVtf2F9bZh9o8S2Ma9/Lhdj+uK6rRf2GdGhZW1TxDeXXqlvEsY/M5rk7v9u7WWUi28M2UZ7GSd2/liuV1r9s3x/qSstqbDTVPeGDcw/FiaPbcKYfWNNzf/AG9+rSD6px/i/dnVjTX/AG5/7amz6m8L/s9fD7wKq3EWjwzSx8/adQbzCPf5uB+VY3xG/ag8GfDu3ktLCZNZ1FBtS1sSPLU/7TDgD6V8SeKPip4t8ZZGsa/e3kZ/5ZNKVT/vkYFcoW9TWNfiyFCDpZXQVNd7L8lp99zrwnh5UxVVYjPcXKs+ybt971t6JHcfFD4u6/8AFbV/ter3G2BD+4s4iRFEPYdz7muJ3UzdTS1fn9atUxFR1a0uaT3bP2DC4Whg6MaGHgowjslsPJrv/gz8ItT+LniiOytkaLToWDXd2R8saZ6D3Paj4P8AwW1z4ua0kFnE1vpkbD7TfOvyIPQep9q/Qj4e/D3SPhr4dg0jR7cRRIMySEfPK3dmPc19pw7w7PMJrEYhWpL/AMm/4HmfnHGPGVLI6TwuEaliJf8Aknm/Psvm9DS8L+GbDwfoNnpGmQLb2drGERVHp3Pua1aKK/coxUUoxVkj+T6lSdWbqVHdvVvuwoooqjMKKKKACiiigCG6tYb63kt7iJJ4JFKvHIoZWB6gg18o/Gz9jhbhrjWfA+Ec5eTSXOFPr5Z7fQ19aUV5mYZbhsypeyxMb9n1Xoz6HJc+x+Q1/bYKdr7p/C/Vfrufkxq2j32g38tlqNpNZXcRw8M6FWH4GqmTX6iePvhT4Y+JVkbfXdLiuXAwlwo2yx/RhzXy58QP2H9W09pbjwnqceowdRaXn7uUewbof0r8jzLhDGYVueF/eR/H7uvy+4/o7JfEbK8xSp439zU89Yv0l0+dvU+Xt1LurofFHw38UeC5mj1nQ7yx2nG94iUP0YcVze6viKtGpRlyVYuL81Y/UqNaliIKpRkpRfVO6/Afupd3vUe6jIrGxtYk3e9Jvpm4UbqLDsO3UZNamg+E9a8UXCw6Tpd1qEjHAEERb9a9y8BfsX+LPEDRT69PDoNocExn95MR9BwPxNerg8qxmOdsPTb8+n37Hh5jneW5THmxteMPK+v3LX8D58gglupkihjaWVzhUQEkn0Ar6N+DH7IOq+Kng1TxYJNJ0vh1tOk8w9/7o/Wvpj4a/s/+EPhjGklhYC61ADm+usPJ+HZfwr0qv03KuD6VBqrjnzP+VbfPv+R+FcQ+JdXERlh8ni4L+d/F8l09Xr6GX4b8M6Z4S0mDTdJtI7KzhXasca4/E+prUoor9IjFRSjFWSPwypUnVk51HdvdvdhRRRVGYUUUUAFFFFABRRRQAUUUUAFFFFAEVxbQ3UZjniSaM9VkUEH864jXvgX4D8SMzX3hiwaRuskcflt+a4rvKKxqUaVZWqRUl5q52YfGYnCS5sPUlB+Ta/I8L1T9jT4c6gxaK2vrEn/n3uTj8mBrDb9hXwQz5Gsa6o/uiWHH/oqvpCivJnkeW1HeVCP3W/I+ip8XZ9SVo4yfzd/zueB6d+xX8PbJgZv7Svcf89rkAH/vlRXaaJ+zr8PNBZWt/DFnI69GuAZT/wCPE16RRXRSyvA0NadGK+SOTEcR5xilati5tf4mvyKlhpVlpcIis7SG1jHAWGMKP0q3RRXppJaI+elKUneTuwooopkhRRRQAUUUUAFFFFAH/9k=';
const janiFirmaBase64 = 'data:image/png;base64,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';

// ================== 2. FUNCIÓN PARA GENERAR EL CONTENIDO DEL CORREO ==================
function getEmailContent(formData) {
  const { solicitante_perfil, solicitante_nombre, servicio_solicitado } = formData;
  const baseHtml = (title, bodyContent) => `
    <!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style> @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); body { font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; } .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.07); border: 1px solid #e1e1e1; } .header { background-color: #1A1A1A; padding: 30px; text-align: center; } .header img { max-width: 120px; } .content { padding: 35px 40px; color: #333333; } .content h2 { color: #1A1A1A; font-size: 22px; margin-top: 0; font-weight: 700; } .content p { font-size: 16px; line-height: 1.7; margin-bottom: 20px; } .highlight { background-color: #f7f7f7; padding: 15px 20px; border-left: 4px solid #F47721; margin-top: 25px; border-radius: 4px; } .highlight p { font-size: 15px; margin: 0; } .footer { background-color: #1A1A1A; padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; } .footer a { color: #F47721; text-decoration: none; } </style>
    </head><body><div class="container"><div class="header"><img src="${logoUrlParaEmail}" alt="Vecy Bienes Raíces Logo"></div><div class="content"><h2>${title}</h2>${bodyContent}</div><div class="footer"><p>Vecy Bienes Raíces S.A.S. © ${new Date().getFullYear()}</p><p><a href="https://vecy.com.co" target="_blank">vecy.com.co</a></p></div></div></body></html>`;
  if (solicitante_perfil === 'Agente') {
    const subject = `📄 Contrato de Colaboración y Confirmación de Solicitud | Vecy Agenda`;
    const title = `Confirmación de Solicitud #${formData.solicitud_id}`;
    const body = `<p>¡Hola, ${solicitante_nombre}!</p><p>Te confirmamos que hemos recibido tu solicitud para el servicio de <strong>"${servicio_solicitado}"</strong> y hemos generado exitosamente el contrato de colaboración.</p><div class="highlight"><p><strong>ID de Solicitud: ${formData.solicitud_id}</strong></p><p style="margin-top: 8px;"><strong>Documento adjunto:</strong> Contrato_Puntas_${solicitante_nombre.replace(/\s/g, '_')}.pdf</p></div><p style="margin-top: 30px;">Este documento formaliza nuestro acuerdo. ¡Estamos listos para alcanzar grandes resultados juntos!</p>`;
    return { subject, html: baseHtml(title, body) };
  } else {
    const subject = `✅ Solicitud Recibida | Vecy Agenda`;
    const title = `¡Hola, ${solicitante_nombre}! Hemos recibido tu solicitud.`;
    const body = `<p>Recibimos tu solicitud para el servicio de <strong>"${servicio_solicitado}"</strong> correctamente a través de Vecy Agenda.</p><p>Nuestro equipo revisará la información y se pondrá en contacto contigo a la brevedad para coordinar los siguientes pasos.</p><div class="highlight"><p><strong>ID de tu Solicitud: ${formData.solicitud_id}</strong>. Consérvalo para futuras referencias.</p></div>`;
    return { subject, html: baseHtml(title, body) };
  }
}

// ================== 3. FUNCIÓN PARA GENERAR EL PDF (VERSIÓN PROFESIONAL) ==================
async function createContractPdf(formData) {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage();
  const { width, height } = currentPage.getSize();

  // --- FUENTES Y COLORES ---
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);
  const gray = rgb(0.3, 0.3, 0.3);

  // --- MÁRGENES Y POSICIÓN INICIAL ---
  const margin = 50;
  let y = height - margin;

  // --- FUNCIONES AUXILIARES PARA EL DISEÑO ---
  const drawFooter = (pageToDrawOn) => {
    const footerText = 'Vecy Bienes Raíces S.A.S. | www.vecy.com.co';
    const footerTextWidth = font.widthOfTextAtSize(footerText, 8);
    pageToDrawOn.drawText(footerText, { x: (width - footerTextWidth) / 2, y: margin / 2, font, size: 8, color: gray });
  };

  const checkAndAddPage = (currentY, neededHeight) => {
    if (currentY - neededHeight < margin + 20) { // Añade un buffer para el pie de página
      drawFooter(currentPage);
      currentPage = pdfDoc.addPage();
      return height - margin;
    }
    return currentY;
  };

  const drawWrappedText = (text, options) => {
    let { y: currentY, font: currentFont, size, x, width: textWidth, lineHeight, color } = options;
    const paragraphs = text.split('\n');
    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line + word + ' ';
        if (currentFont.widthOfTextAtSize(testLine, size) > textWidth && line.length > 0) {
          currentY = checkAndAddPage(currentY, lineHeight);
          currentPage.drawText(line, { x, y: currentY, font: currentFont, size, color });
          line = word + ' ';
          currentY -= lineHeight;
        } else {
          line = testLine;
        }
      }
      currentY = checkAndAddPage(currentY, lineHeight);
      currentPage.drawText(line, { x, y: currentY, font: currentFont, size, color });
      currentY -= lineHeight;
    }
    return currentY;
  };

  const drawClause = (title, content, currentY) => {
    currentY = checkAndAddPage(currentY, 32); // Espacio para el título y un poco más
    currentPage.drawText(title, { x: margin, y: currentY, font: boldFont, size: 11, color: black });
    currentY -= 18;
    currentY = drawWrappedText(content, { y: currentY, font, size: 10, x: margin, width: width - margin * 2, lineHeight: 14, color: black });
    return currentY - 10; // Espacio después de la cláusula
  };

  // --- ENCABEZADO ---
  try {
    const vecyLogoImage = await pdfDoc.embedJpg(vecyLogoBase64);
    currentPage.drawImage(vecyLogoImage, { x: margin, y: y - 25, width: 50, height: 50 });
  } catch (e) { console.error("Error al incrustar el logo de Vecy en el PDF.", e.message); }
  
  currentPage.drawText('CONTRATO DE PUNTAS COMPARTIDAS', { x: margin + 70, y: y, font: boldFont, size: 16, color: black });
  currentPage.drawText('Acuerdo de Colaboración Inmobiliaria', { x: margin + 70, y: y - 18, font: font, size: 11, color: gray });

  // ID de la solicitud en el encabezado
  if (formData.solicitud_id) {
    const idText = `Solicitud ID: ${formData.solicitud_id}`;
    const idTextWidth = boldFont.widthOfTextAtSize(idText, 9);
    currentPage.drawText(idText, { x: width - margin - idTextWidth, y: y, font: boldFont, size: 9, color: gray });
  }
  y -= 70;

  // --- CUERPO DEL CONTRATO ---
  const visitDate = formData.fecha_cita ? new Date(formData.fecha_cita).toLocaleString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' }) : 'No especificada';
  const generationDate = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' });

  const introText = `Entre los suscritos a saber, por una parte, JANI ALVES SOUZA, mayor de edad, identificada con cédula de ciudadanía No. 41.057.506, actuando en representación de VECY BIENES RAÍCES, quien en adelante se denominará EL AGENTE 1; y por la otra parte, ${formData.solicitante_nombre}, mayor de edad, identificado(a) con ${formData.solicitante_tipo_documento} No. ${formData.solicitante_numero_documento}, quien en adelante se denominará EL AGENTE 2, se celebra el presente contrato de colaboración inmobiliaria, regido por las siguientes cláusulas:`;
  y = drawWrappedText(introText, { y, font, size: 10, x: margin, width: width - margin * 2, lineHeight: 14, color: black });
  y -= 15;

  // --- CLÁUSULAS ---
  const clausula1 = `El presente contrato tiene por objeto establecer los términos de colaboración entre EL AGENTE 1 y EL AGENTE 2 para promover, gestionar y/o contribuir en la intermediación del negocio inmobiliario relacionado con el inmueble identificado con el código ${formData.codigo_inmueble || 'N/A'}, donde EL AGENTE 2 mediante el formulario No. ${formData.solicitud_id}, solicita al AGENTE 1 "${formData.servicio_solicitado}" para el día ${visitDate}, en favor del cliente ${formData.interesado_nombre}, identificado(a) con ${formData.interesado_tipo_documento} No. ${formData.interesado_documento}.`;
  y = drawClause('CLÁUSULA PRIMERA: OBJETO', clausula1, y);

  const clausula2 = `Los honorarios derivados del negocio serán distribuidos en partes iguales (50% para cada parte), salvo pacto distinto por escrito. Si EL AGENTE 2 únicamente refiere al cliente o la punta que tiene al cliente sin participar activamente en visitas, negociaciones o acompañamiento, su comisión será del 20%.`;
  y = drawClause('CLÁUSULA SEGUNDA: HONORARIOS', clausula2, y);

  const clausula3 = `Obligaciones de EL AGENTE 1:\n• Promocionar el inmueble y mostrarlo a los interesados referidos por EL AGENTE 2.\n• Proporcionar la documentación e información necesarias para el cierre del negocio.\n• Coordinar las visitas y diligencias conjuntas.\n• Velar por el cumplimiento legal y ético de la gestión inmobiliaria.\n\nObligaciones de EL AGENTE 2:\n• Presentar prospectos reales y debidamente identificados.\n• Acompañar las visitas, negociaciones y cierre cuando sea requerido.\n• Colaborar activamente con la gestión del negocio, incluyendo la entrega de documentos y seguimiento.\n• Respetar el canal de comunicación institucional, absteniéndose de realizar acuerdos o negociaciones directamente con los clientes o propietarios sin previa autorización expresa y escrita de EL AGENTE 1.`;
  y = drawClause('CLÁUSULA TERCERA: OBLIGACIONES DE LAS PARTES', clausula3, y);

  const clausula4 = `El presente contrato tendrá una duración de tres (3) meses contados a partir de la fecha de su emisión o firma digital. En caso de que el negocio inmobiliario se materialice antes del vencimiento de este término, el acuerdo continuará vigente hasta su culminación.`;
  y = drawClause('CLÁUSULA CUARTA: DURACIÓN', clausula4, y);

  const clausula5 = `Las partes se obligan a mantener en estricta reserva la información confidencial a la que tengan acceso con ocasión de este contrato. Cualquier solicitud, comunicación o modificación relacionada con el inmueble y/o sus propietarios deberá gestionarse exclusivamente a través de EL AGENTE 1, quien es el interlocutor autorizado ante el cliente y titular del encargo profesional.`;
  y = drawClause('CLÁUSULA QUINTA: CONFIDENCIALIDAD Y CONDUCTO REGULAR', clausula5, y);

  const clausula6 = `El incumplimiento de cualquiera de las obligaciones aquí establecidas dará lugar a una sanción equivalente al 100% de la comisión pactada a favor de la parte cumplida, sin perjuicio de las acciones legales que puedan derivarse por daños y perjuicios, conforme a lo dispuesto en el Código Civil y el Código de Comercio.`;
  y = drawClause('CLÁUSULA SEXTA: INCUMPLIMIENTO Y PENALIDAD', clausula6, y);

  const clausula7 = `Este contrato tiene plena validez jurídica desde el momento de su emisión digital. Las firmas digitales, electrónicas o manuscritas escaneadas se entienden como aceptadas por las partes y son válidas conforme a la Ley 527 de 1999 y las normas que regulan el comercio electrónico en Colombia.`;
  y = drawClause('CLÁUSULA SÉPTIMA: VALIDEZ Y FIRMA DIGITAL', clausula7, y);

  // --- FIRMAS ---
  y = checkAndAddPage(y, 150); // Revisa si hay espacio para las firmas
  const firmaText = `En constancia de lo anterior, las partes firman el presente documento el día ${generationDate}.`;
  y = drawWrappedText(firmaText, { y, font, size: 10, x: margin, width: width - margin * 2, lineHeight: 14, color: black });
  y -= 30;

  // Firma Agente 1 (Jani)
  try {
    const janiFirmaImage = await pdfDoc.embedPng(janiFirmaBase64);
    currentPage.drawImage(janiFirmaImage, { x: margin + 40, y: y - 30, width: 100, height: 40 });
  } catch(e) { console.error("Error al incrustar la firma de Jani en el PDF.", e.message); }
  currentPage.drawLine({ start: { x: margin, y: y - 35 }, end: { x: margin + 200, y: y - 35 }, thickness: 0.5, color: black });
  currentPage.drawText('JANI ALVES SOUZA', { x: margin + 50, y: y - 45, font: boldFont, size: 9 });
  currentPage.drawText('C.C. 41.057.506', { x: margin + 60, y: y - 55, font, size: 8 });
  currentPage.drawText('AGENTE 1 - VECY BIENES RAÍCES', { x: margin + 25, y: y - 65, font, size: 8 });

  // Firma Agente 2
  const agentSignatureX = width - margin - 200;
  if (formData.firma_virtual_base64 && formData.firma_virtual_base64.startsWith('data:image')) {
    try {
      const agentFirmaImage = await pdfDoc.embedPng(formData.firma_virtual_base64);
      currentPage.drawImage(agentFirmaImage, { x: agentSignatureX + 50, y: y - 30, width: 100, height: 40 });
    } catch(e) { console.error("Error al incrustar la firma del agente en el PDF.", e.message); }
  } else {
    currentPage.drawText('(Firma Digital Adjunta)', { x: agentSignatureX + 45, y: y - 10, font, size: 9, color: gray });
  }
  currentPage.drawLine({ start: { x: agentSignatureX, y: y - 35 }, end: { x: width - margin, y: y - 35 }, thickness: 0.5, color: black });
  currentPage.drawText(formData.solicitante_nombre.toUpperCase(), { x: agentSignatureX, y: y - 45, font: boldFont, size: 9 });
  currentPage.drawText(`${formData.solicitante_tipo_documento} No. ${formData.solicitante_numero_documento}`, { x: agentSignatureX, y: y - 55, font, size: 8 });
  currentPage.drawText('AGENTE 2', { x: agentSignatureX, y: y - 65, font, size: 8 });

  // --- PIE DE PÁGINA FINAL ---
  drawFooter(currentPage);

  const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: false });
  return pdfBytes;
}

// ================== 4. FUNCIÓN PRINCIPAL DEL SERVIDOR ==================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }
  try {
    const formData = await req.json();
    const { solicitante_perfil, solicitante_nombre, solicitante_email } = formData;
    const { subject, html } = getEmailContent(formData);
    const attachments = [];
    if (solicitante_perfil === 'Agente') {
      const pdfBase64 = await createContractPdf(formData);
      attachments.push({
        content: pdfBase64,
        filename: `Contrato_Puntas_${solicitante_nombre.replace(/\s/g, '_')}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
      });
    }
    const emailPayload = {
      personalizations: [{ to: [{ email: solicitante_email }] }],
      from: { email: 'vecybienesraices@gmail.com', name: 'Vecy Bienes Raíces' },
      subject,
      content: [{ type: 'text/html', value: html }],
    };
    if (attachments.length > 0) { emailPayload.attachments = attachments; }
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error de SendGrid:', errorBody);
      throw new Error(`Error al enviar el correo: ${errorBody}`);
    }
    return new Response(JSON.stringify({ message: 'Correo enviado exitosamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Error en la función principal:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
